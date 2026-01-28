# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public issue
2. Email security details to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.

## Security Best Practices

When using this application:

### Environment Variables
- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Rotate API keys regularly
- Use different credentials for dev/staging/production

### Webhooks
- Always verify webhook signatures
- Use HTTPS endpoints only
- Keep webhook secrets secure
- Monitor webhook logs for suspicious activity

### Database
- Use SSL/TLS for database connections
- Implement proper access controls
- Regular backups
- Monitor for unusual queries

### Authentication
- Enable MFA for admin accounts
- Use Clerk's security features
- Implement rate limiting
- Monitor failed login attempts

### Dependencies
- Keep all packages up to date
- Run `npm audit` regularly
- Review security advisories
- Test updates in staging first

## Known Security Considerations

1. **Webhook Endpoints**: Ensure webhook URLs are not publicly listed
2. **API Keys**: Keep Razorpay and Clerk keys secure
3. **Redis Cache**: Contains user data, secure the connection
4. **Database**: PostgreSQL credentials must be protected

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Monitor the CHANGELOG.md for security-related updates.
