# Security Policy

## Reporting Security Vulnerabilities

**Please do not open public GitHub issues for security vulnerabilities.**

If you discover a security vulnerability in ForgeStack OS, please email:
**[sumitchauhan10062004@gmail.com](mailto:sumitchauhan10062004@gmail.com)**

Include:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if known)

We will respond within 48 hours and work toward a fix.

## Supported Versions

| Version | Supported  | EOL        |
| ------- | ---------- | ---------- |
| 0.3.x   | ✅ Yes     | 2026-12-31 |
| 0.2.x   | ⚠️ Limited | 2026-06-30 |
| < 0.2   | ❌ No      | N/A        |

## Security Practices

- All dependencies are regularly audited (`npm audit --production`).
- Node 20+ required for modern security features.
- No telemetry or data collection in CLI.
- Generated projects include HTTPS-ready templates.
- Secrets (JWT, database URLs) must be configured via environment variables, never committed.

## Dependency Updates

We monitor security advisories via:

- npm audit
- GitHub Dependabot
- npm security team alerts

Critical vulnerabilities trigger immediate patch releases.

## Responsible Disclosure

We follow [OWASP Responsible Disclosure](https://owasp.org/www-community/attacks/xss/) practices and appreciate coordinated vulnerability disclosure.

Thank you for helping keep ForgeStack OS secure.
