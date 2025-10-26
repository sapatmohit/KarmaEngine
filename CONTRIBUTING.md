# Contributing to KarmaEngine

Thank you for your interest in contributing to KarmaEngine! We're excited to have you join our community. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Be kind, constructive, and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/KarmaEngine.git
   cd KarmaEngine
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/KarmaEngine.git
   ```

## Development Setup

### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Smart Contract Setup

```bash
cd karma-engine/contracts/karma-engine
make build
make test
```

### Mobile App Setup

```bash
cd karma_engine_app
flutter pub get
flutter run
```

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in the [Issues](../../issues)
- If not, create a new issue with a clear title and description
- Include steps to reproduce, expected behavior, and actual behavior
- Add screenshots or logs if applicable

### Suggesting Features

- Open an issue with the `enhancement` label
- Clearly describe the feature and its benefits
- Explain how it fits into the project's goals

### Code Contributions

1. **Find an issue** to work on or create one
2. **Comment on the issue** to let others know you're working on it
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Commit your changes** with clear commit messages
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against the `main` branch

## Pull Request Process

1. **Update documentation** if you've changed APIs or added features
2. **Add tests** for new functionality
3. **Ensure all tests pass** before submitting
4. **Update the README.md** if necessary
5. **Link related issues** in your PR description
6. **Request review** from maintainers
7. **Address review comments** promptly
8. **Squash commits** if requested before merging

### PR Title Format

Use descriptive titles with prefixes:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add Instagram sentiment analysis integration`

## Coding Standards

### JavaScript/Node.js (Backend/Frontend)

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused
- Use async/await for asynchronous code

### Rust (Smart Contracts)

- Follow Rust naming conventions
- Use `cargo fmt` before committing
- Run `cargo clippy` and fix warnings
- Write comprehensive tests
- Document public functions and modules

### Dart/Flutter (Mobile App)

- Follow Flutter/Dart style guide
- Use `flutter format` before committing
- Implement proper state management
- Handle errors gracefully
- Write widget tests for UI components

### General Guidelines

- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **SOLID** principles
- Write self-documenting code
- Add comments for complex algorithms

## Testing Guidelines

### Backend Testing

```bash
cd Backend
npm test
```

- Write unit tests for controllers and services
- Test API endpoints with integration tests
- Mock external dependencies
- Aim for >80% code coverage

### Frontend Testing

```bash
cd frontend
npm test
```

- Test components in isolation
- Test user interactions
- Mock API calls
- Test edge cases and error states

### Smart Contract Testing

```bash
cd karma-engine/contracts/karma-engine
make test
```

- Test all contract functions
- Test edge cases and failure scenarios
- Verify gas optimization
- Check for security vulnerabilities

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Example

```
feat(backend): add Instagram sentiment analysis

- Integrated sentiment analysis API
- Added new endpoint for content analysis
- Updated InstagramContent model

Closes #123
```

## Project Structure

```
KarmaEngine/
├── Backend/          # Node.js backend API
├── frontend/         # Next.js web application
├── karma-engine/     # Stellar smart contracts
└── karma_engine_app/ # Flutter mobile app
```

## Questions?

If you have questions or need help:
- Open a [Discussion](../../discussions)
- Reach out to maintainers
- Check existing documentation

## Recognition

Contributors will be recognized in our README.md. Thank you for making KarmaEngine better! 🎉

---

**Happy Contributing!** 🚀
