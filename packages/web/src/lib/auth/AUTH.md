# Admin Authorization

## Rationale

- Dev mode needs a persisted cache because file saves restart the process and invalidate in-memory stores
- For prod: Single long-running server instance, so in-memory store for session tokens and OTP is fine
- Only a single admin, so a single session slot is fine
- Guessing the admin email is not that hard, so we don't have to protect it much
