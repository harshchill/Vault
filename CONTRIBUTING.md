# Contributing to Vault

Thank you for your interest in contributing to Vault! We're excited to have you help make the exam paper sharing platform even better. Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, your contributions are valuable to us.

## Welcome & Contribution Types

We welcome contributions in many forms:

- **Bug Fixes** – Found a bug? Help us squash it!
- **Feature Requests & Implementations** – Have an idea? Let's discuss and build it together
- **Documentation** – Improve README, guides, code comments, or this file
- **Performance Improvements** – Optimize queries, components, or API responses
- **Testing** – Add tests or improve test coverage
- **Design & UX** – Suggest UI/UX improvements or accessibility enhancements
- **Security** – Report vulnerabilities responsibly

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9+ or **pnpm**
- **Git**
- A GitHub account

### Local Development Setup

1. **Fork the Repository**
   - Click "Fork" on the [Vault repository](https://github.com/yourusername/vault) to create your own copy

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/vault.git
   cd vault
   ```

3. **Add Upstream Remote** (to sync with main repo)
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/vault.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Follow the instructions in `.env.example` to set up:
     - MongoDB Atlas database
     - Supabase project & storage
     - Upstash Redis instance
     - GitHub OAuth credentials
     - Google OAuth credentials
     - Resend email API key
   - See [README.md](./README.md#getting-started) for detailed setup instructions

6. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Changes automatically reload (hot module reloading enabled)

7. **Run Linter**
   ```bash
   npm run lint
   ```
   - Fix issues with: `npm run lint -- --fix`

---

## Development Workflow

### Creating a Feature Branch

1. **Update Your Fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a Feature Branch**
   - Use descriptive names with prefixes:
     - `fix/` for bug fixes: `fix/paper-search-null-error`
     - `feat/` for features: `feat/add-paper-preview-modal`
     - `docs/` for documentation: `docs/update-contributing-guide`
     - `refactor/` for code improvements: `refactor/optimize-pdf-caching`
     - `test/` for tests: `test/add-paper-upload-tests`
   
   ```bash
   git checkout -b fix/your-feature-name
   ```

### Making Changes

1. **Write Clean Code**
   - Follow the code standards below
   - Make small, focused commits
   - Run `npm run lint` before committing

2. **Write Descriptive Commits**
   - Use [Conventional Commits](https://www.conventionalcommits.org/):
     ```
     feat(papers): add search filters for subject and year
     
     - Added subject dropdown to filter papers
     - Added year range selector
     - Updated API query parameters
     - Closes #123
     ```
   - Examples:
     - `fix(auth): handle missing GitHub profile picture`
     - `feat(leaderboard): add monthly ranking view`
     - `docs(readme): add deployment instructions`
     - `refactor(api): consolidate rate limit logic`
     - `test(papers): add upload validation tests`

3. **Test Your Changes**
   - Run `npm run dev` and manually test in browser
   - Test multiple scenarios (success, error, edge cases)
   - Check for console errors/warnings

4. **Keep Your Branch Updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

---

## Code Standards

### General Rules

- **No hardcoded secrets** – All credentials go in `.env.local` (never commit `.env.local`)
- **No `console.log()` in production code** – Use proper logging or remove debug statements
- **Comments for complex logic** – Explain the "why", not the "what"
- **Follow existing patterns** – Match the style of similar code in the codebase

### JavaScript/React Standards

- **Use ES6+ syntax** – `const`/`let`, arrow functions, async/await
- **Component naming** – PascalCase for components: `PaperUploadModal.js`
- **File naming** – camelCase for utility files: `rateLimit.js`, PascalCase for components
- **Props & State** – Use meaningful names: `isLoading`, `onSubmit`, not `x`, `handleClick`
- **ESLint rules** – Run `npm run lint` before committing; fix auto-fixable issues with `npm run lint -- --fix`

### Next.js / App Router Specifics

- **API Routes** – Use proper HTTP methods: GET for reading, POST for creating, PATCH for updating
- **Server vs Client** – Use `"use client"` at top of client components; keep API logic on server
- **Dynamic Routes** – Use brackets: `[id].js`, `[...slug].js`
- **Metadata** – Define page metadata in `layout.js` or `page.js` using `metadata` export

### Tailwind CSS Standards

- **Utility classes only** – Don't create custom CSS unless absolutely necessary
- **Dark mode** – Consider dark mode variants: `dark:bg-gray-900`
- **Responsive design** – Use breakpoints: `md:`, `lg:`, `xl:`
- **Color consistency** – Use defined color palette from `tailwind.config.js`

### Mongoose / MongoDB Standards

- **Schema validation** – Enforce required fields, enums, indexes in schema
- **No N+1 queries** – Use `populate()` strategically; avoid fetching data in loops
- **Index heavy queries** – Add indexes for frequently queried fields
- **Error handling** – Catch and handle MongoDB errors (duplicate keys, validation, connection)

### Security Best Practices

- **Never log sensitive data** – No passwords, tokens, API keys in logs or errors
- **Validate & sanitize input** – Check user input on both client and server
- **Rate limiting** – Use `lib/rateLimit.js` for API endpoints that modify data
- **CORS & CSRF** – Respect NextAuth security defaults; don't bypass them
- **SQL/NoSQL Injection** – Use Mongoose queries (not raw strings) and parameterized values

---

## Pull Request Process

### Before Submitting

1. **Ensure your code is ready**
   ```bash
   npm run lint -- --fix   # Auto-fix linting issues
   npm run dev             # Test locally
   ```

2. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   git push origin fix/your-feature-name --force-with-lease
   ```

3. **Create a Pull Request**
   - Go to [GitHub](https://github.com/yourusername/vault) → "Compare & pull request"
   - Use the [PR template](.github/pull_request_template.md) (auto-populated)
   - Link related issues: `Closes #123`
   - Provide a clear description of changes

### PR Template Checklist

When you open a PR, fill out the template:

```markdown
## Description
Brief summary of what this PR does.

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Branch name follows convention (fix/, feat/, etc.)
- [ ] Commits follow conventional commit format
- [ ] `npm run lint` passes (no errors)
- [ ] Tested locally in browser
- [ ] Updated documentation/README if needed
- [ ] No hardcoded secrets or env vars
- [ ] No console.log() statements left in code
```

### Review Process

- **Maintainers review** all PRs for code quality, security, and alignment with project goals
- **Feedback within 3-5 business days** typically (maintainers are volunteers)
- **Requested changes** – Make updates, re-request review
- **Approval** – PR merged by a maintainer
- **Feedback on rejection** – We'll explain why and suggest next steps

---

## Reporting Issues

### Bug Reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md):

1. **Clear title** – What's broken? Example: "Papers fail to load when filtering by year"
2. **Reproduction steps**
   - What did you do?
   - What happened?
   - What did you expect?
3. **Environment**
   - Browser & version
   - Node version (from `npm -v`)
   - OS (Windows, Mac, Linux)
4. **Screenshots/Logs** – Attach browser console errors, network errors, etc.

### Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md):

1. **Problem statement** – What pain point does this solve?
2. **Proposed solution** – How should it work?
3. **Alternatives** – Any other approaches considered?
4. **Why it matters** – Who benefits and why?

### Discussion

- Unsure if something's a bug? Open a [GitHub Discussion](https://github.com/yourusername/vault/discussions)
- Want to brainstorm an idea? Start a discussion before opening an issue

---

## Security & Responsible Disclosure

### Reporting Security Issues

⚠️ **Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, email **harshmahto02@gmail.com** with:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

We will:
- Acknowledge receipt within 24 hours
- Investigate and develop a fix
- Release a patch
- Credit you in the release notes (unless you prefer anonymity)

### What We Consider Security Issues

- Authentication/authorization bypass
- Data exposure (private papers, user info leaks)
- Injection attacks (SQL, NoSQL, XSS)
- Rate limiting bypass
- CSRF vulnerabilities
- File upload exploits

---

## Code of Conduct

This project is governed by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. In short:

- Be respectful and inclusive
- Assume good intent
- Provide constructive feedback
- No harassment, discrimination, or exclusion

**Violations** should be reported to **harshmahto02@gmail.com**. Enforcement actions are determined by the project maintainers.

---

## Recognition & Credits

We celebrate our contributors! Your contributions may be:

- Mentioned in release notes
- Listed in a [CONTRIBUTORS.md](./CONTRIBUTORS.md) file
- Credited in commit messages

---

## Questions?

- 💬 **GitHub Discussions** – [Start a discussion](https://github.com/yourusername/vault/discussions)
- 📧 **Email** – harshmahto02@gmail.com
- 💡 **Documentation** – [README.md](./README.md), [Architecture](./README.md#architecture-summary)

---

## Additional Resources

- [Git & GitHub Guide](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Contributor Covenant](https://www.contributor-covenant.org/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/)

---

## Thank You!

Every contribution, no matter how small, helps Vault grow. We're grateful for your time, effort, and passion for making exam papers more accessible to students everywhere. 🎓

Happy coding! 🚀
