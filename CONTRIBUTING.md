# 🤝 Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! This document provides guidelines and instructions for contributing.

**GitHub Repository**: https://github.com/LonHeidenreich/fhevm-react-template

**Live Demo**: https://violation-handler.vercel.app/

---

## 🌟 Ways to Contribute

### 1. Report Bugs
Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)
- Code sample if applicable

### 2. Suggest Features
Have an idea? Open an issue with:
- Feature description
- Use case and benefits
- Proposed implementation (optional)
- Examples from other projects (optional)

### 3. Improve Documentation
- Fix typos or clarify existing docs
- Add examples and use cases
- Translate documentation (currently English only)
- Create tutorials or blog posts

### 4. Submit Code
- Fix bugs
- Implement new features
- Improve performance
- Add tests
- Refactor code

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Git
- Basic understanding of TypeScript and FHE concepts

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
cd fhevm-react-template

# 3. Install dependencies
npm ci

# 4. Build the SDK
npm run build:sdk

# 5. Run tests
npm run test --workspace=@zama/fhevm-sdk

# 6. Start example app
npm run dev --workspace=traffic-violation-reporter
```

---

## 📁 Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Main SDK package
│       ├── src/
│       │   ├── core/           # Framework-agnostic core
│       │   ├── adapters/       # Framework adapters
│       │   └── index.ts        # Main exports
│       └── README.md           # SDK documentation
│
├── examples/
│   └── traffic-violation-reporter/  # Example application
│
├── docs/                       # Additional documentation
└── .github/
    └── workflows/              # CI/CD workflows
```

---

## 🔧 Development Workflow

### 1. Create a Branch

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Or bug fix branch
git checkout -b fix/bug-description
```

### 2. Make Changes

#### SDK Core Changes
```bash
cd packages/fhevm-sdk/src/core
# Edit files: client.ts, encryption.ts, decryption.ts
```

#### React Adapter Changes
```bash
cd packages/fhevm-sdk/src/adapters/react
# Edit index.ts
```

#### Example Changes
```bash
cd examples/traffic-violation-reporter
# Edit app files
```

### 3. Write Tests

```typescript
// packages/fhevm-sdk/src/__tests__/encryption.test.ts
import { encrypt, encryptUint32 } from '../core/encryption';

describe('Encryption', () => {
  it('should encrypt uint32 values', async () => {
    const client = await createTestClient();
    const encrypted = await encryptUint32(client, 1000);

    expect(encrypted.data).toBeDefined();
    expect(encrypted.signature).toBeDefined();
  });
});
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run specific workspace tests
npm run test --workspace=@zama/fhevm-sdk

# Run with coverage
npm run test:coverage --workspace=@zama/fhevm-sdk
```

### 5. Check Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### 6. Commit Changes

Follow conventional commit format:

```bash
# Feature
git commit -m "feat: add batch encryption support"

# Bug fix
git commit -m "fix: resolve permit validation issue"

# Documentation
git commit -m "docs: update encryption examples"

# Performance
git commit -m "perf: optimize client initialization"

# Tests
git commit -m "test: add decryption edge cases"
```

**Commit Message Format**:
```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 7. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
```

---

## 📝 Pull Request Guidelines

### PR Title
Use conventional commit format:
```
feat: Add Vue adapter for FHEVM SDK
fix: Resolve memory leak in client initialization
docs: Add framework integration examples
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes
- Include technical details
- Reference related issues

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guide
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages follow convention
```

### Code Review Process

1. **Automated Checks**: CI/CD runs automatically
   - Linting
   - Type checking
   - Unit tests
   - Build verification
   - Security scanning

2. **Manual Review**: Maintainers review
   - Code quality
   - Architecture alignment
   - Performance impact
   - Documentation completeness

3. **Feedback**: Address review comments
   - Make requested changes
   - Push updates to same branch
   - Re-request review

4. **Merge**: Once approved
   - Squash and merge (typically)
   - Delete branch after merge

---

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// Test individual functions
describe('encrypt', () => {
  it('should encrypt boolean values', async () => {
    const result = await encrypt(client, true);
    expect(result.data).toBeDefined();
  });
});
```

### Integration Tests
```typescript
// Test complete workflows
describe('FHE Workflow', () => {
  it('should encrypt, submit, and decrypt', async () => {
    const encrypted = await encrypt(client, 42);
    await contract.submit(encrypted.data, encrypted.signature);
    const permit = await requestPermit(...);
    const decrypted = await decrypt(client, handle, permit);
    expect(decrypted).toBe(42);
  });
});
```

### Test Coverage
- Aim for 80%+ coverage
- Cover edge cases
- Test error handling
- Test loading states

---

## 📖 Documentation Guidelines

### Code Comments
```typescript
/**
 * Encrypts a value for FHEVM contract interaction
 *
 * @param client - Initialized FHEVM client
 * @param value - Value to encrypt (supports multiple types)
 * @returns Encrypted input with data and signature
 * @throws {Error} If client is not initialized or encryption fails
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt(client, 42);
 * await contract.submit(encrypted.data, encrypted.signature);
 * ```
 */
export async function encrypt(
  client: FhevmClient,
  value: number | bigint | boolean | string
): Promise<EncryptedInput> {
  // Implementation
}
```

### README Updates
- Keep README.md concise
- Move detailed docs to docs/ folder
- Include code examples
- Update table of contents

### API Documentation
- Document all public APIs
- Include parameter types
- Show return types
- Provide examples
- Note breaking changes

---

## 🎨 Code Style Guide

### TypeScript Style

```typescript
// ✅ Good
export interface FhevmClientConfig {
  network: NetworkType | NetworkConfig;
  provider?: EIP1193Provider;
  privateKey?: string;
  gatewayUrl?: string;
  aclAddress?: string;
}

// ❌ Avoid
export interface FhevmClientConfig {
  network: any;
  provider?: any;
}
```

### Naming Conventions

```typescript
// Functions: camelCase
function createFhevmClient() {}
function encryptUint32() {}

// Classes: PascalCase
class FhevmClient {}

// Constants: UPPER_SNAKE_CASE
const DEFAULT_TIMEOUT = 30000;

// Types/Interfaces: PascalCase
interface EncryptedInput {}
type NetworkType = 'sepolia' | 'localhost';
```

### File Organization

```typescript
// 1. Imports
import { createInstance } from 'fhevmjs';
import type { FhevmClient } from './types';

// 2. Types
export interface ClientConfig {
  // ...
}

// 3. Constants
const DEFAULT_CONFIG = {
  // ...
};

// 4. Helper functions
function validateConfig() {
  // ...
}

// 5. Main exports
export async function createClient() {
  // ...
}
```

---

## 🔒 Security Guidelines

### Never Commit Secrets
```bash
# ❌ Never commit
.env
*.key
credentials.json

# ✅ Use .env.example instead
PRIVATE_KEY=0x1234...
WALLETCONNECT_PROJECT_ID=abc123...
```

### Security Checks
- Run `npm audit` before submitting
- No hardcoded credentials
- Validate all user inputs
- Use HTTPS for external URLs
- Follow least privilege principle

---

## 🌍 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards others

### Communication
- Use GitHub Issues for bugs/features
- Use Discussions for questions
- Keep discussions focused
- Search before posting
- Provide context and examples

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Featured on project website (if applicable)

---

## 📞 Getting Help

### Resources
- **Documentation**: [README.md](./README.md)
- **SDK Reference**: [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)
- **Examples**: [examples/](./examples/)
- **Issues**: [GitHub Issues](https://github.com/LonHeidenreich/fhevm-react-template/issues)

### Contact
- Open an issue for bugs or features
- Start a discussion for questions
- Tag maintainers for urgent matters

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Universal FHEVM SDK!** 🎉

Your contributions help make FHE development more accessible to everyone.
