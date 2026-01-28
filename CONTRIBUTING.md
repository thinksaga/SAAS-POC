# Contribution Guidelines

Thank you for considering contributing to SaaS POC! 

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/saas-poc.git
cd saas-poc

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your credentials

# Setup database
npm run db:push

# Run development server
npm run dev
```

## Code Standards

- Write clean, readable TypeScript code
- Follow the existing code style
- Add comments for complex logic
- Ensure all types are properly defined
- Run `npm run lint` before committing

## Testing

- Test all features locally before submitting PR
- Verify database operations work correctly
- Check webhook integrations
- Test responsive design on mobile

## Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure build passes (`npm run build`)
- Keep PRs focused on a single feature/fix

## Reporting Issues

- Check if issue already exists
- Provide clear steps to reproduce
- Include error messages and logs
- Specify your environment (OS, Node version, etc.)

## Questions?

Feel free to open an issue for any questions or discussions.
