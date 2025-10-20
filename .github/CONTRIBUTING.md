# Contributing to CodinIT

First off, thank you for considering contributing to CodinIT! 🎉

CodinIT.dev is an open-source AI-powered code generator, and we welcome contributions from developers of all skill levels. Whether you're fixing a bug, adding a feature, improving documentation, or just asking questions, your contribution matters.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Security Guidelines](#security-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [gerome.e24@gmail.com](mailto:gerome.e24@gmail.com).

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Please help us fix it:

1. **Check existing issues** - Search our [GitHub issues](https://github./Gerome-Elassaad/CodingIT/issues) first
2. **Use the bug report template** - Provide detailed information using our bug report template
3. **Include reproduction steps** - Clear steps help us fix bugs faster
4. **Add relevant labels** - Help us categorize the issue

### 💡 Suggesting Features

We love new ideas! To suggest a feature:

1. **Check the roadmap** - See if it's already planned
2. **Open a feature request** - Use our feature request template
3. **Explain the use case** - Help us understand why this feature would be valuable
4. **Provide examples** - Mock-ups, user stories, or code examples are helpful

### 🔧 Code Contributions

Ready to code? Here's how:

1. **Find an issue** - Look for issues labeled `good first issue` or `help wanted`
2. **Fork the repository** - Create your own copy
3. **Create a branch** - Use a descriptive name like `feature/file-upload-validation`
4. **Make your changes** - Follow our coding standards
5. **Test thoroughly** - Ensure your changes don't break existing functionality
6. **Submit a pull request** - Use our PR template

### 📚 Documentation

Help make CodinIT.dev more accessible:

- Fix typos or unclear instructions
- Add examples and tutorials
- Improve API documentation
- Translate documentation (coming soon)

### 🎨 Design & UX

Improve the user experience:

- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Design system contributions

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.17+ and npm
- **Git** for version control
- **E2B API Key** - [Get one here](https://e2b.dev)
- **Supabase Project** - [Create one here](https://supabase.com)
- **AI Provider API Key** - At least one of: Claude, OpenAI, Google AI, etc.

### Local Setup

1. **Fork and clone the repository**

    ```bash
    git clone https://github.com/Gerome-Elassaad/CodingIT.git
    cd CodingIT
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Fill in your API keys and configuration:

    ```env
    # Required
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    E2B_API_KEY=your_e2b_api_key

    # AI Providers (at least one required)
    ANTHROPIC_API_KEY=your_claude_api_key
    OPENAI_API_KEY=your_openai_api_key
    GOOGLE_AI_API_KEY=your_google_ai_key

    # Optional
    VERCEL_KV_URL=your_kv_url
    VERCEL_KV_REST_API_TOKEN=your_kv_token
    ```

4. **Set up the database**

    ```bash
    # Run Supabase migrations (if any)
    npx supabase db reset
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Format code
npm run format

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
CodingIT/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat endpoints
│   │   ├── sandbox/       # E2B sandbox endpoints
│   │   └── upload-files/  # File upload endpoints
│   ├── settings/          # Settings pages
│   └── page.tsx           # Main chat interface
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── chat.tsx          # Chat interface
│   ├── preview.tsx       # Code preview/execution
│   └── navbar.tsx        # Navigation
├── lib/                  # Utility functions and configs
│   ├── auth.ts          # Authentication logic
│   ├── models.ts        # AI model configurations
│   ├── templates.ts     # Code generation templates
│   └── utils.ts         # General utilities
├── styles/              # Global styles
├── public/              # Static assets
└── sandbox-templates/   # E2B sandbox configurations
```

## 📏 Coding Standards

### TypeScript Guidelines

- **Strict TypeScript** - Enable strict mode and fix all type errors
- **Explicit types** - Prefer explicit typing over `any`
- **Interface over type** - Use interfaces for object shapes
- **Proper exports** - Use named exports for utilities, default for components

```typescript
// ✅ Good
interface UserProfile {
    id: string
    name: string
    email: string
}

export function validateEmail(email: string): boolean {
    // implementation
}

// ❌ Avoid
const validateEmail = (email: any) => {
    // implementation
}
```

### React Guidelines

- **Functional components** - Use function components with hooks
- **TypeScript props** - Always type component props
- **Descriptive names** - Use clear, descriptive component names
- **Single responsibility** - Keep components focused on one task

```tsx
// ✅ Good
interface ChatMessageProps {
    message: string
    isUser: boolean
    timestamp: Date
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
    return (
        <div className={`message ${isUser ? 'user' : 'assistant'}`}>
            {message}
        </div>
    )
}

// ❌ Avoid
export function Message(props: any) {
    return <div>{props.msg}</div>
}
```

### API Route Guidelines

- **Type safety** - Use proper TypeScript types for requests/responses
- **Error handling** - Implement comprehensive error handling
- **Validation** - Validate all inputs
- **Consistent responses** - Use consistent response formats

```typescript
// ✅ Good
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        if (!body.prompt || typeof body.prompt !== 'string') {
            return NextResponse.json(
                { error: 'Invalid prompt' },
                { status: 400 },
            )
        }

        // Process request
        const result = await generateCode(body.prompt)

        return NextResponse.json({ success: true, result })
    } catch (error) {
        console.error('Generation failed:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
```

### CSS/Styling Guidelines

- **Tailwind CSS** - Use Tailwind utility classes
- **Dark mode support** - Ensure all styles work in both light and dark modes
- **Responsive design** - Mobile-first responsive design
- **Semantic classes** - Use semantic class names when needed

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-background text-foreground">
  <button className="btn-primary hover:btn-primary-hover dark:bg-primary-dark">
    Generate Code
  </button>
</div>

// ❌ Avoid
<div style={{ display: 'flex', padding: '24px' }}>
  <button style={{ backgroundColor: '#blue' }}>Generate</button>
</div>
```

### File and Folder Naming

- **kebab-case** - For file and folder names
- **PascalCase** - For React component files
- **camelCase** - For utility functions and variables
- **Descriptive names** - Use clear, descriptive names

```
✅ Good
components/ChatMessage.tsx
lib/auth-utils.ts
app/api/upload-files/route.ts

❌ Avoid
components/cm.tsx
lib/utils.ts
app/api/upload/route.ts
```

## 🧪 Testing Guidelines

### Testing Strategy

We use a multi-layered testing approach:

1. **Unit tests** - Test individual functions and components
2. **Integration tests** - Test API endpoints and workflows
3. **E2E tests** - Test complete user journeys
4. **Manual testing** - Test with real AI providers and sandboxes

### Writing Tests

```typescript
// Unit test example
import { validateEmail } from '@/lib/utils';

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('user@codingit.dev')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
});

// Component test example
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@/components/ChatMessage';

describe('ChatMessage', () => {
  it('should render user messages correctly', () => {
    render(
      <ChatMessage
        message="Hello world"
        isUser={true}
        timestamp={new Date()}
      />
    );

    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByTestId('user-message')).toBeInTheDocument();
  });
});
```

### Test Requirements

- **New features** - Must include tests
- **Bug fixes** - Must include regression tests
- **API endpoints** - Must test success and error cases
- **Components** - Must test key functionality and edge cases

## 🔄 Pull Request Process

### Before Submitting

1. **Create an issue** - Discuss large changes first
2. **Fork the repository** - Work on your own copy
3. **Create a feature branch** - Use descriptive branch names
4. **Follow coding standards** - Run linters and formatters
5. **Write tests** - Ensure good test coverage
6. **Update documentation** - Keep docs in sync with changes

### PR Requirements

- [ ] **Descriptive title** - Clearly explain what the PR does
- [ ] **Detailed description** - Use our PR template
- [ ] **Tests included** - Add tests for new functionality
- [ ] **Documentation updated** - Update relevant docs
- [ ] **No breaking changes** - Or clearly document them
- [ ] **Linting passes** - All linting and type checks pass
- [ ] **Size is reasonable** - Large PRs should be split up

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] E2E tests pass (if applicable)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new linting errors
- [ ] Tests added for new functionality

## Screenshots (if applicable)

Add screenshots of UI changes

## Additional Notes

Any additional information or context
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs automatically
2. **Code review** - At least one maintainer reviews
3. **Feedback addressed** - Make requested changes
4. **Final approval** - Maintainer approves and merges

## 📝 Issue Guidelines

### Issue Types

- **🐛 Bug Report** - Something isn't working
- **✨ Feature Request** - New functionality
- **📚 Documentation** - Improvements to docs
- **🎨 Design** - UI/UX improvements
- **🔧 Maintenance** - Code cleanup, refactoring
- **❓ Question** - General questions

### Issue Labels

We use labels to categorize and prioritize issues:

**Priority:**

- `priority: critical` - Urgent fixes needed
- `priority: high` - Important features/fixes
- `priority: medium` - Normal priority
- `priority: low` - Nice to have

**Component:**

- `component: frontend` - UI/UX related
- `component: backend` - API/server related
- `component: ai` - AI integration
- `component: sandbox` - E2B sandbox
- `component: auth` - Authentication

**Status:**

- `status: needs review` - Waiting for review
- `status: in progress` - Being worked on
- `status: blocked` - Blocked by dependencies
- `status: help wanted` - Community help welcome

**Difficulty:**

- `good first issue` - Perfect for newcomers
- `difficulty: easy` - Simple changes
- `difficulty: medium` - Moderate complexity
- `difficulty: hard` - Complex changes

## 🔒 Security Guidelines

### Reporting Security Issues

**⚠️ DO NOT** open public issues for security vulnerabilities.

Instead, email us at [security@codingit.dev](mailto:security@codingit.dev) with:

1. **Description** - Detail of the vulnerability
2. **Impact** - Potential impact and affected users
3. **Reproduction** - Steps to reproduce (if safe)
4. **Suggestions** - Any ideas for fixes

We'll respond within 24 hours and work with you to resolve the issue.

### Security Best Practices

When contributing, please:

- **Never commit secrets** - No API keys, passwords, or tokens
- **Validate all inputs** - Sanitize user inputs
- **Use environment variables** - For sensitive configuration
- **Follow OWASP guidelines** - Web security best practices
- **Audit dependencies** - Keep dependencies updated

```typescript
// ✅ Good - Input validation
export async function POST(request: Request) {
    const body = await request.json()

    // Validate and sanitize inputs
    if (!body.prompt || typeof body.prompt !== 'string') {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    if (body.prompt.length > 10000) {
        return NextResponse.json({ error: 'Input too large' }, { status: 400 })
    }

    // Process safely...
}

// ❌ Avoid - No validation
export async function POST(request: Request) {
    const body = await request.json()
    // Direct usage without validation
    const result = await processInput(body.prompt)
}
```

## 🌟 Recognition

We believe in recognizing our contributors:

- **Contributors list** - All contributors listed in README
- **Release notes** - Major contributors mentioned in releases
- **Special thanks** - Outstanding contributions highlighted
- **Swag** - Contributors may receive CodinIT.dev swag (when available)

### Types of Contributions We Recognize

- Code contributions (features, bug fixes)
- Documentation improvements
- Design and UX contributions
- Community support and moderation
- Testing and quality assurance
- Translations (coming soon)
- Advocacy and evangelism

## 📞 Community & Support

### Where to Get Help

- **🐛 Bugs**: [GitHub Issues](https://github.com/Gerome-Elassaad/CodingIT/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Gerome-Elassaad/CodingIT/discussions)
- **📧 Email**: [support@codingit.dev](mailto:support@codingit.dev)
- **💭 Discord**: [Join our community](https://discord.gg/codingit)
- **📖 Documentation**: [docs.codingit.dev](https://docs.codingit.dev)

### Communication Guidelines

- **Be respectful** - Treat everyone with respect
- **Be patient** - Remember that maintainers are volunteers
- **Be helpful** - Help others when you can
- **Stay on topic** - Keep discussions relevant
- **Search first** - Check existing issues and discussions

### Office Hours

We hold virtual office hours:

- **When**: Every Friday, 3 PM UTC
- **Where**: Discord voice channel
- **What**: Q&A, live help, community discussions

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0) - Breaking changes
- **Minor** (1.1.0) - New features, backwards compatible
- **Patch** (1.1.1) - Bug fixes, backwards compatible

### Release Schedule

- **Patch releases** - As needed for critical fixes
- **Minor releases** - Every 2-4 weeks
- **Major releases** - Every 3-6 months

## 📄 License

By contributing to CodinIT, you agree that your contributions will be licensed under the same [Apache 2.0](LICENSE) that covers the project.

---

## 🙏 Thank You!

Your contributions help make CodinIT.dev better for everyone. Whether you're fixing a typo, adding a feature, or helping other users, every contribution matters.

**Happy coding!** 🚀

---

_This contributing guide is inspired by open source best practices and is continually updated based on community feedback._
