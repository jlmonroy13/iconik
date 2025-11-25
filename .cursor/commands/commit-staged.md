# Commit All Changes

Add and commit all changes in the working directory with an intelligent, descriptive commit message based on the actual changes made.

## Usage

@commit-all [commit-message]

## Description

This command will:

1. Analyze the changes in the working directory
2. Generate a descriptive commit message based on the types of files modified
3. Add all modified and untracked files to the staging area
4. Create a commit with the intelligent message or use the provided custom message
5. Show the commit summary

## Examples

```bash
# Commit with intelligent message generation
@commit-all

# Commit with custom message (overrides intelligent generation)
@commit-all "feat: add new feature implementation"
```

## Intelligent Message Generation

The command analyzes changes and generates appropriate commit messages:

### File Type Analysis

- **Components** (`src/components/`): `feat: update component functionality`
- **Hooks** (`src/hooks/`): `feat: improve hook logic`
- **Pages** (`src/pages/`): `feat: enhance page features`
- **Utils** (`src/utils/`): `refactor: improve utility functions`
- **Types** (`src/types/`): `feat: add new type definitions`
- **Stores** (`src/stores/`): `feat: update state management`
- **Styles** (`src/styles/`): `style: update styling`
- **Tests** (`**/*.test.*`, `**/*.spec.*`): `test: add/update tests`
- **Config** (`*.config.*`, `config/`): `config: update configuration`
- **Dependencies** (`package.json`, `bun.lock`): `chore: update dependencies`

### Change Type Detection

- **New files**: `feat: add [description]`
- **Modified files**: `feat: update [description]`
- **Deleted files**: `refactor: remove [description]`
- **Mixed changes**: `feat: implement [description]`

### Conventional Commit Format

- Uses proper conventional commit prefixes: `feat:`, `fix:`, `refactor:`, `style:`, `test:`, `chore:`, `config:`
- Includes descriptive text based on file patterns and changes
- Maintains consistency with project standards

## Safety Features

- Checks if there are any changes to commit before proceeding
- Shows a detailed summary of what will be committed
- Analyzes file changes to generate meaningful messages
- Uses conventional commit format for better git history
- Validates commit message format before creating commit
