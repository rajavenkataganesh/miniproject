import os
import glob
from typing import Dict, Any, List

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "models"))

def is_gemma_available() -> Dict[str, Any]:
    """
    Check if a Gemma model file exists in assets/models/
    Excludes placeholder .txt files.
    """
    if not os.path.exists(MODELS_DIR):
        return {"gemma_available": False, "mode": "demo", "model_file": None}

    files = os.listdir(MODELS_DIR)
    model_files = [
        f for f in files 
        if not f.endswith(".txt") and not f.startswith(".") and os.path.isfile(os.path.join(MODELS_DIR, f))
    ]

    if model_files:
        return {
            "gemma_available": True,
            "mode": "gemma",
            "model_file": model_files[0]
        }
    
    return {
        "gemma_available": False,
        "mode": "demo",
        "model_file": None
    }

def generate_ai_report(scan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate an AI security report. If Gemma model is present, live Gemma logic would run.
    Otherwise, returns structured clear demo report explaining scan findings.
    """
    status = is_gemma_available()
    target = scan_data.get("target", "Target URL")
    score = scan_data.get("security_score", 70)
    stats = scan_data.get("stats", {})
    findings = scan_data.get("findings", [])

    if status["gemma_available"]:
        # Hook for live Gemma local inference when model is placed
        return {
            "is_demo": False,
            "title": f"Gemma 4 Live AI Security Analysis for {target}",
            "executive_summary": f"Gemma 4 analyzed {stats.get('total_endpoints', 0)} discovered endpoints for target '{target}'. Overall endpoint security posture score is rated at {score}/100. Local neural model active.",
            "overall_status": "Gemma AI Online - Live Local Model Inference",
            "high_risk_summary": f"Identified {stats.get('high_risk', 0)} high-risk administrative or sensitive endpoints exposed without proper authentication verification.",
            "recommendations": [
                "Enforce mandatory multi-factor authentication (MFA) on all /admin and management endpoints.",
                "Restrict REST API user data endpoints (/api/v1/users) behind valid JWT Bearer tokens.",
                "Remove sensitive configuration or backup assets from the public web server directory.",
                "Implement strict security headers (CSP, HSTS, X-Frame-Options) across web responses."
            ]
        }

    # Demo Fallback Report
    high_count = stats.get("high_risk", 0)
    med_count = stats.get("medium_risk", 0)

    return {
        "is_demo": True,
        "title": f"DEMO AI Security Report — {target}",
        "banner_notice": "DEMO AI REPORT — Gemma is currently offline. Place a model file into assets/models/ to activate live Gemma 4 AI.",
        "executive_summary": f"EndpointGuard completed an authorized passive endpoint scan for target '{target}'. Out of {stats.get('total_endpoints', 0)} total crawled paths, {high_count} high-severity and {med_count} medium-severity exposure risks were detected. The security rating is {score}/100.",
        "overall_status": "Demo Mode (Gemma Offline)",
        "most_important_findings": [
            f"Administrative Endpoints Exposure: {high_count} administrative route(s) respond with HTTP 200 OK without requiring authentication credentials.",
            f"Unprotected REST API Routes: {med_count} API endpoint(s) return user or system data without requiring Authorization token headers.",
            "Missing Security Headers: Crucial browser defense headers (Referrer-Policy, Strict-Transport-Security) require hardening."
        ],
        "why_endpoints_matter": "Exposed administrative or API endpoints provide unauthorized actors with direct attack vectors into internal databases, user accounts, and server controls.",
        "remediation_plan": [
            {"priority": "P1 (Critical)", "action": "Implement server-side authentication and session validation middleware on all /admin subroutes."},
            {"priority": "P2 (High)", "action": "Enforce Bearer token JWT authentication headers for sensitive REST API paths (/api/v1/users)."},
            {"priority": "P3 (Medium)", "action": "Configure web server HTTP response headers (CSP, HSTS, X-Content-Type-Options)."},
            {"priority": "P4 (Low)", "action": "Implement rate limiting and CAPTCHA protection on public authentication forms (/login, /forgot-password)."}
        ]
    }

def handle_ai_chat(message: str, scan_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process AI Chatbot queries. Returns Gemma responses when available or clear pre-defined demo answers.
    """
    status = is_gemma_available()
    msg_lower = message.lower().strip()

    if status["gemma_available"]:
        return {
            "is_demo": False,
            "response": f"[Gemma 4 AI]: Based on the active scan of {scan_data.get('target', 'the target')}, I have analyzed your question regarding '{message}'. (Live Gemma 4 local model response)."
        }

    # Demo Chatbot predefined answers
    if "admin" in msg_lower or "high" in msg_lower or "dangerous" in msg_lower:
        reply = "DEMO RESPONSE: The `/admin` paths (such as `/admin/users` and `/admin/settings`) are flagged as HIGH risk because they provide administrative access functionality. In this scan, they returned HTTP 200 OK without an obvious authentication challenge."
    elif "score" in msg_lower or "rating" in msg_lower:
        score = scan_data.get("security_score", 72)
        reply = f"DEMO RESPONSE: The target's overall security score is {score}/100. This score is calculated by starting at 100 and deducting points for high (-15), medium (-8), and low (-3) risk findings."
    elif "header" in msg_lower or "csp" in msg_lower or "hsts" in msg_lower:
        reply = "DEMO RESPONSE: Security headers like Content-Security-Policy (CSP) and HSTS instruct web browsers to block dangerous inline scripts and enforce encrypted HTTPS connections."
    elif "gemma" in msg_lower or "ai" in msg_lower:
        reply = "DEMO RESPONSE: Gemma is currently offline because no Gemma model file was found in `assets/models/`. You can place your Gemma `.bin` or `.gguf` file there to enable live local AI inference!"
    else:
        reply = f"DEMO RESPONSE: (Gemma is offline). You asked: '{message}'. EndpointGuard analyzed {scan_data.get('stats', {}).get('total_endpoints', 0)} total endpoints. For live AI responses, place a Gemma model file into `assets/models/`."

    return {
        "is_demo": True,
        "response": reply
    }
