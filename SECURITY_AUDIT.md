# AMAN Platform — Security Audit & Law 09-08 / CNDP Compliance Report

## 1. Implemented Technical Controls
- **Encryption at Rest**: Sensitive beneficiary fields (`description`, `safe_contact`) are encrypted using **AES-256-GCM** (`enc:v1:...`) via `AMAN_ENCRYPTION_KEY` before storage in SQLite.
- **Password & Session Security**: Staff passwords hashed with `crypto.scryptSync` + per-user random salt and verified with `crypto.timingSafeEqual`. Sessions use 256-bit random tokens with 12-hour expiration.
- **Role-Based Access Control (RBAC)**: Strict separation between technical administration (`super_admin`, `platform_admin`) and case-level access (`safeguarding_supervisor`, `women_caseworker`, `child_caseworker`).
- **Audio Isolation**: Voice reports are stored outside the public webroot (`data/audio/`) and served only to authorized caseworkers via `/api/audio/:id`.
- **Data Retention & Redaction**: `DELETE /api/cases/:id/redact` allows authorized supervisors to permanently redact sensitive fields and delete audio files while preserving anonymized statistical integrity.
- **Audit Logging**: Immutable `audit_logs` table records authentication events, case access, status changes, audio access, and redactions with hashed IP addresses.
- **Analytics Suppression**: Minimum group-size threshold (`MIN_THRESHOLD = 5`) prevents re-identification in aggregated reports.

## 2. Moroccan Law 09-08 & CNDP Checklist (Pre-Production)
- [ ] Submit formal CNDP declaration / authorization for processing sensitive protection data.
- [ ] Configure `AMAN_ENCRYPTION_KEY` in production environment variables (never commit to Git).
- [ ] Enable HTTPS/TLS termination via reverse proxy (Nginx/Caddy).
- [ ] Complete specialist legal review of child consent, mandatory referral duties, and retention schedules.
