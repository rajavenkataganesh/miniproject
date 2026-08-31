import urllib.parse
from bs4 import BeautifulSoup
import httpx
import asyncio
from typing import List, Dict, Any, Set

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 EndpointGuard/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
}

def normalize_url(url: str) -> str:
    """Ensure URL has http/https scheme and is stripped of whitespace."""
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    parsed = urllib.parse.urlparse(url)
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, parsed.query, ""))

def extract_domain(url: str) -> str:
    """Extract network domain name."""
    parsed = urllib.parse.urlparse(url)
    return parsed.netloc.lower()

async def fetch_endpoint(client: httpx.AsyncClient, current_url: str, target_domain: str) -> Dict[str, Any]:
    parsed_current = urllib.parse.urlparse(current_url)
    path = parsed_current.path or "/"
    if parsed_current.query:
        path += f"?{parsed_current.query}"

    try:
        resp = await client.get(current_url)
        status_code = resp.status_code
        content_type = resp.headers.get("content-type", "")
        
        extracted_links = []
        if "text/html" in content_type and resp.text:
            soup = BeautifulSoup(resp.text, "html.parser")
            for a_tag in soup.find_all("a", href=True):
                href = a_tag["href"].strip()
                if not href or href.startswith("#") or href.startswith("javascript:") or href.startswith("mailto:"):
                    continue
                joined_url = urllib.parse.urljoin(current_url, href)
                joined_parsed = urllib.parse.urlparse(joined_url)
                if joined_parsed.netloc.lower() == target_domain:
                    extracted_links.append(joined_url)

        return {
            "url": path,
            "full_url": current_url,
            "method": "GET",
            "status_code": status_code,
            "headers": {k: v for k, v in resp.headers.items()},
            "accessible": status_code in [200, 201, 202, 301, 302, 304],
            "extracted_links": extracted_links
        }
    except Exception as e:
        return {
            "url": path,
            "full_url": current_url,
            "method": "GET",
            "status_code": 0,
            "headers": {},
            "accessible": False,
            "extracted_links": [],
            "error": str(e)
        }

async def async_safe_crawl(target_url: str, max_pages: int = 15) -> Dict[str, Any]:
    """
    Perform a single sub-second concurrent passive crawl with unthrottled connection pool.
    """
    normalized_target = normalize_url(target_url)
    target_domain = extract_domain(normalized_target)
    
    https_enabled = normalized_target.startswith("https://")
    response_headers: Dict[str, Any] = {}

    common_test_paths = ["/login", "/admin", "/api/v1/users", "/robots.txt", "/sitemap.xml", "/.env"]
    urls_to_fetch = [normalized_target] + [urllib.parse.urljoin(normalized_target, p) for p in common_test_paths]

    limits = httpx.Limits(max_keepalive_connections=20, max_connections=30)

    # 0.4s timeout per request for ultra-fast parallel fetch
    async with httpx.AsyncClient(headers=HEADERS, limits=limits, timeout=0.4, follow_redirects=True, verify=False) as client:
        tasks = [fetch_endpoint(client, url, target_domain) for url in urls_to_fetch]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        raw_endpoints = []

        for res in results:
            if isinstance(res, dict):
                if res["full_url"] == normalized_target and res.get("headers"):
                    response_headers = res["headers"]
                    if res["full_url"].startswith("https://"):
                        https_enabled = True

                raw_endpoints.append({
                    "url": res["url"],
                    "full_url": res["full_url"],
                    "method": res["method"],
                    "status_code": res["status_code"],
                    "headers": res["headers"],
                    "accessible": res["accessible"]
                })

                for link in res.get("extracted_links", []):
                    parsed_link = urllib.parse.urlparse(link)
                    path = parsed_link.path or "/"
                    if not any(ep["url"] == path for ep in raw_endpoints) and len(raw_endpoints) < max_pages:
                        raw_endpoints.append({
                            "url": path,
                            "full_url": link,
                            "method": "GET",
                            "status_code": 200,
                            "headers": {},
                            "accessible": True
                        })

    return {
        "target": normalized_target,
        "domain": target_domain,
        "https_enabled": https_enabled,
        "headers": response_headers,
        "raw_endpoints": raw_endpoints
    }
