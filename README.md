# pr-sanitizer

[![CI](https://github.com/your-org/pr-sanitizer/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/pr-sanitizer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PR Friendly](https://img.shields.io/badge/code%20reviews-safe%20%26%20constructive-brightgreen)](https://github.com/your-org/pr-sanitizer)

> **Review better, merge smarter.**
> `pr-sanitizer` automatically scans PR review comments for offensive language, vague feedback, or harsh tone—and rewrites them into constructive, helpful suggestions.

---

## 🚀 Features

- 🧼 **Sanitizes** PR review comments with offensive, inappropriate, or unprofessional language.
- 🧠 **Provides actionable tips** to developers based on vague or unhelpful comments.
- 🤝 **Encourages respectful communication** and inclusive team culture.
- ⚙️ Easy integration as a **GitHub Action** or **CLI tool**.

---

## 📦 Installation

### 🔧 Option 1: As a GitHub Action

1. Add the following workflow to `.github/workflows/pr-sanitizer.yml`:

```yaml
name: PR Sanitizer

on:
  pull_request_review:
    types: [submitted, edited]

jobs:
  sanitize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run PR Sanitizer
        uses: your-org/pr-sanitizer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

🔧 Option 2: Using NPM

npm install --save-dev @types/minimist

npm run build

node dist/cli.js --repo your-org/your-repo --pr 123 --token ghp_XXXX


You can generate one at https://github.com/settings/tokens (select the repo scope for private repos).
node dist/cli.js --repo ravikiran763/hello-world-java --pr 1 --token ghp_XXXX
```