import re
from typing import List, Dict, Any

# Path pattern rules for category classification
CATEGORY_RULES = [
    ("Admin", [r"^/admin", r"^/administrator", r"^/manage", r"^/dashboard", r"^/control", r"^/panel"]),
    ("API", [r"^/api", r"^/v1", r"^/v2", r"^/graphql", r"^/rest", r"^/service"]),
    ("Authentication", [r"^/login", r"^/register", r"^/auth", r"^/signup", r"^/forgot-password", r"^/reset-password", r"^/logout"]),
    ("User", [r"^/user", r"^/profile", r"^/account", r"^/settings", r"^/billing", r"^/invoices", r"^/orders", r"^/dashboard/user"]),
    ("Static", [r"\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|ttf|xml|txt)$", r"^/assets", r"^/static", r"^/robots\.txt", r"^/sitemap\.xml"]),
    ("Public", [r"^/$", r"^/about", r"^/contact", r"^/pricing", r"^/docs", r"^/privacy", r"^/terms", r"^/faq", r"^/help"])
]

# Sensitive paths requiring protection check
SENSITIVE_PATTERNS = [
    (r"^/admin", "HIGH", "Admin", "Potentially sensitive administrative endpoint appears publicly accessible without auth barrier."),
    (r"^/config", "MEDIUM", "Other", "Configuration file path exposed on web server path."),
    (r"^/internal", "MEDIUM", "Other", "Internal infrastructure path is publicly reachable."),
    (r"^/api/.*/(users|accounts|admin|keys)", "MEDIUM", "API", "Potentially sensitive REST API endpoint exposed without authorization header."),
    (r"^/user/(invoices|billing|financial)", "MEDIUM", "User", "Potentially sensitive billing endpoint accessible without auth token check."),
    (r"/(backup|\.env|\.git|db\.json)", "HIGH", "Other", "Potentially exposed system sensitive asset file.")
]

SECURITY_HEADER_DEFS = {
    "Strict-Transport-Security": {
        "name": "Strict-Transport-Security (HSTS)",
        "description": "Enforces secure HTTPS connections and prevents SSL stripping."
    },
    "Content-Security-Policy": {
        "name": "Content-Security-Policy (CSP)",
        "description": "Restricts sources of executable scripts, stylesheets, and frame embed assets."
    },
    "X-Frame-Options": {
        "name": "X-Frame-Options",
        "description": "Protects users against clickjacking attacks by controlling iframe embedding."
    },
    "X-Content-Type-Options": {
        "name": "X-Content-Type-Options",
        "description": "Prevents browsers from MIME-sniffing response content types."
    },
    "Referrer-Policy": {
        "name": "Referrer-Policy",
        "description": "Controls how much HTTP referrer information is transmitted in requests."
    }
}

def classify_category(path: str) -> str:
    path_lower = path.lower()
    for category, patterns in CATEGORY_RULES:
        for pattern in patterns:
            if re.search(pattern, path_lower):
                return category
    return "Other"

def analyze_headers(headers: Dict[str, str]) -> Dict[str, Any]:
    norm_headers = {k.lower(): v for k, v in headers.items()}
    results = {}

    for header_key, meta in SECURITY_HEADER_DEFS.items():
        val = norm_headers.get(header_key.lower())
        if val:
            if header_key == "Content-Security-Policy" and "unsafe-inline" in val.lower():
                results[header_key] = {
                    "status": "WARNING",
                    "value": val,
                    "description": "CSP header is present but contains 'unsafe-inline' directive."
                }
            else:
                results[header_key] = {
                    "status": "PASS",
                    "value": val,
                    "description": meta["description"]
                }
        else:
            results[header_key] = {
                "status": "MISSING",
                "value": None,
                "description": f"{meta['name']} header is missing."
            }

    return results

def analyze_endpoints_and_findings(raw_endpoints: List[Dict[str, Any]]) -> Dict[str, Any]:
    processed_endpoints = []
    findings = []
    finding_counter = 1

    stats = {
        "total_endpoints": len(raw_endpoints),
        "public_endpoints": 0,
        "sensitive_endpoints": 0,
        "protected_endpoints": 0,
        "high_risk": 0,
        "medium_risk": 0,
        "low_risk": 0,
        "info": 0
    }

    for ep in raw_endpoints:
        path = ep["url"]
        status_code = ep.get("status_code", 0)
        accessible = ep.get("accessible", False)
        category = classify_category(path)

        risk = "INFO"
        reason = "Standard endpoint response"
        recommendation = "No security remediation needed."
        requires_protection = False

        # Sensitivity analysis
        is_sensitive = False
        matched_severity = "LOW"
        matched_reason = ""

        for pattern, severity, cat, r_text in SENSITIVE_PATTERNS:
            if re.search(pattern, path.lower()):
                is_sensitive = True
                requires_protection = True
                matched_severity = severity
                matched_reason = r_text
                break

        if category in ["Admin", "User", "API"] and path != "/":
            requires_protection = True

        # Protection evaluation
        if accessible and status_code in [200, 201, 202]:
            if is_sensitive:
                risk = matched_severity
                reason = matched_reason
                recommendation = "Require multi-factor authentication, session validation, and server-side authorization checks."

                findings.append({
                    "id": f"FIND-{finding_counter:03d}",
                    "endpoint": path,
                    "severity": risk,
                    "category": category,
                    "title": f"Potentially exposed {category.lower()} endpoint",
                    "reason": reason,
                    "impact": f"Unauthorized visitors might gain access or insight into sensitive {category.lower()} interfaces.",
                    "solution": recommendation
                })
                finding_counter += 1

            elif category == "Authentication" and path in ["/login", "/forgot-password", "/register"]:
                risk = "LOW"
                reason = "Public authentication entrypoint lacks rate-limiting headers"
                recommendation = "Implement IP rate limiting and anti-brute-force CAPTCHA mechanisms."
                findings.append({
                    "id": f"FIND-{finding_counter:03d}",
                    "endpoint": path,
                    "severity": "LOW",
                    "category": category,
                    "title": f"Public authentication interface rate-limit recommendation",
                    "reason": reason,
                    "impact": "Potential exposure to automated login attempts or user enumeration.",
                    "solution": recommendation
                })
                finding_counter += 1

        elif status_code in [401, 403, 302, 301]:
            stats["protected_endpoints"] += 1
            reason = f"Endpoint returns HTTP {status_code} protection or redirection signal."
            recommendation = "Maintain current access restriction policy."

        # Counts update
        if category == "Public":
            stats["public_endpoints"] += 1
        if requires_protection:
            stats["sensitive_endpoints"] += 1

        if risk == "HIGH":
            stats["high_risk"] += 1
        elif risk == "MEDIUM":
            stats["medium_risk"] += 1
        elif risk == "LOW":
            stats["low_risk"] += 1
        else:
            stats["info"] += 1

        processed_endpoints.append({
            "url": path,
            "method": ep.get("method", "GET"),
            "category": category,
            "status_code": status_code,
            "accessible": accessible,
            "requires_protection": requires_protection,
            "risk": risk,
            "reason": reason,
            "recommendation": recommendation
        })

    # Calculate overall security score (0 - 100)
    deductions = (stats["high_risk"] * 15) + (stats["medium_risk"] * 8) + (stats["low_risk"] * 3)
    security_score = max(10, min(100, 100 - deductions))

    return {
        "security_score": security_score,
        "stats": stats,
        "endpoints": processed_endpoints,
        "findings": findings
    }
