# Security Policy

## Supported versions

Only the latest revision of the default branch receives security updates. This project is an early-stage portfolio application and does not currently publish versioned security releases.

## Reporting a vulnerability

Do not report security vulnerabilities through a public issue. Use GitHub's private vulnerability reporting feature on the repository's **Security** tab. If private reporting is unavailable, contact the maintainer through the private contact method listed on their GitHub profile.

Include, where possible:

- a concise description and the affected component;
- reproducible steps or a minimal proof of concept;
- the expected and observed impact;
- suggested remediation, if known.

Do not include real credentials, access tokens, personal data, or production records in a report. Use synthetic test data and redact screenshots or logs.

The maintainer will aim to acknowledge a complete report within 7 days, assess its severity, and provide a remediation status within 30 days. These are targets, not a service-level agreement. Please allow a reasonable remediation window before public disclosure.

## Safe-harbor expectations

Good-faith research that avoids privacy violations, service disruption, data destruction, social engineering, automated high-volume testing, and access beyond what is necessary to demonstrate the issue is welcome. Stop testing and report immediately if you encounter user data or gain unintended access.

## Security model

- Authentication and data access are expected to use Supabase Auth and PostgreSQL Row Level Security (RLS).
- The public Supabase anon key is a browser identifier, not an authorization boundary; RLS policies must enforce authorization for every exposed table and operation.
- Service-role keys and other privileged credentials must never be exposed to the browser, committed to the repository, or placed in `NEXT_PUBLIC_*` variables.
- Repository and CI configuration must not contain deployment or test credentials.
- Local secrets belong in ignored environment files. See `.env.example` for the names of public configuration values only.

Security controls should be verified against the deployed Supabase project before processing real or sensitive data.
