# Git Suggest Command

Analyzes staged changes and suggests branch names and commit messages following the project's git conventions.

## Instructions

When the user types `/git-suggest`, the AI assistant MUST follow this procedure:

1. **Propose Command**: The assistant must first propose the execution of the `git diff --staged` command via the available terminal tool. This is to get the exact changes staged for commit.
2. **Analyze Output**: After the user approves and the command is executed, the assistant will receive the output. The assistant must analyze this output to understand the changes.
   - If the output is empty, the assistant should respond with: "No staged changes found. Use 'git add' to stage the files you want to include in the commit."
3. **Generate Suggestion**: Based on the analysis of the `git diff` output, the assistant will generate:
   - A branch name following the kebab-case and prefix conventions defined below.
   - A commit message following the conventional commit format (TITLE LINE ONLY) defined below.
4. **Present Suggestion**: The assistant will present ONLY the branch name and the commit message title line to the user. The response language must follow @language.mdc rules.

## Branch Naming Conventions

- Use kebab-case for branch names
- Always include a type prefix:
  - `feat/` - New features
  - `fix/` - Bug fixes
  - `docs/` - Documentation changes
  - `style/` - Code style changes (formatting, etc)
  - `refactor/` - Code refactoring
  - `perf/` - Performance improvements
  - `test/` - Adding or modifying tests
  - `chore/` - Maintenance tasks
  - `ci/` - CI/CD changes

### Branch Examples:

```
feat/user-authentication
fix/login-validation
docs/api-endpoints
chore/cursor-git-commands
```

## Commit Message Format

```
type(scope): description
```

- **type**: Same as branch prefixes (feat, fix, docs, etc.)
- **scope**: Component or module affected (user, auth, api, etc.)
- **description**: Concise change description in imperative mood. **It must be in lowercase** and not start with a capital letter.

### Commit Examples:

```
feat(user): add email verification flow
fix(auth): resolve token expiration issue
docs(api): update endpoint documentation
style(components): format according to style guide
chore(config): add custom git-suggest slash command for cursor
```

## Available Scopes

Common scopes in this project:

- **General**: user, auth, api, db, config, ui, components, utils, types, tests
- **Domain-specific**: timesheet, employee, schedule

## Output Format

```
Branch:
[type]/[descriptive-name]

Commit message:
[type]([scope]): [description]
```

## Error Handling

If no staged changes found, respond with:

```
No staged changes found.
Use 'git add' to stage the files you want to include in the commit.
```
