# AMAN Platform — Installation & Deployment Guide

## Prerequisites
- Node.js >= 22.0.0 (uses built-in `node:sqlite` and `node:test`)

## Local Development
1. Copy `.env.example` to `.env` and configure variables.
2. Start the server:
   ```bash
   npm start
   ```
3. Run automated tests:
   ```bash
   node --test tests/api.test.js
   ```

## Production & Pilot Notes (Laâyoune)
- Always run behind HTTPS (reverse proxy such as Nginx or Caddy).
- Back up `data/aman.db` and `data/audio/` on an encrypted schedule.
- Complete Moroccan Law 09-08 / CNDP compliance and institutional partner verification before enabling live beneficiary data.
