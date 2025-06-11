# pr-sanitizer

**Review better, merge smarter.**  
`pr-sanitizer` automatically scans PR review comments for PI information, vague feedback, or harsh tone—and rewrites them into constructive, helpful suggestions.

---

## 🚀 Features

- 🧼 Sanitizes PR review comments containing sensitive PI information and unprofessional language.
- 🧠 Provides actionable tips to developers based on vague or unhelpful comments.
- 🤝 Encourages respectful communication and fosters an inclusive team culture.
- ⚙️ Easy integration as a GitHub Action or CLI tool.

---


## 🔧 Usage/Installation

To integrate `pr-sanitizer` into your GitHub workflow:

1. **Create a workflow file**:  
   In your repository, create a new file at `.github/workflows/pr-sanitizer.yml`.

2. **Add the workflow configuration**:  
   Paste the following content into the newly created file:

   ```yaml
   name: Sanitize PR Comments

   on:
     pull_request_review_comment:
       types: [created, edited]

   jobs:
     sanitize:
       runs-on: ubuntu-latest
       permissions:
         pull-requests: write
         contents: write
         issues: write
         actions: write
       steps:
         - name: Run PR sanitizer action
           uses: ravikiran763/pr-sanitizer@v7 # Make sure to use the correct version tag
           with:
             token: ${{ secrets.GITHUB_TOKEN }}
             openaiApiKey: ${{ secrets.OPENAI_API_KEY }} # Use openaiApiKey here
             pr: ${{ github.event.pull_request.number }}
             repo: ${{ github.repository }}
   ```

### 🔑 Obtain your Gemini AI API Key

If you don't have one, generate a Gemini AI API key from the [Google AI Studio](https://aistudio.google.com/).

---

### 🔐 Add API Key as a GitHub Secret

1. Navigate to your GitHub repository.
2. Go to **Settings > Secrets and variables > Actions**.
3. Click on **New repository secret**.
4. For the **Name**, enter `OPENAI_API_KEY`.
5. For the **Secret**, paste your Gemini AI API key.
6. Click **Add secret**.

Now, whenever a pull request review comment is created or edited, the `pr-sanitizer` action will automatically run and sanitize the comment.

---

## 🔧 Contribution

### 📦 Install dependencies

```bash
npm install --save-dev @types/minimist
```

### 🛠️ Build the project
Make the necessary code changes and then build the project to ensure everything is compiled correctly.
```bash
npm run build
```

### 🚀 Run the CLI tool
```bash
node dist/cli.js --repo your-org/your-repo --pr 123 --token ghp_XXXX --openaiApiKey sk-XXXX
```
Replace:

- your-org/your-repo with your repository name
- 123 with the pull request number
- ghp_XXXX with your GitHub Personal Access Token (PAT)
You can generate a PAT from https://github.com/settings/tokens.
Ensure it has the repo scope selected for private repositories.
- sk-XXXX with your Gemini API key.
  If you don't have one, generate a Gemini AI API key from the [Google AI Studio](https://aistudio.google.com/).

### 🚀 Releasing a New Version
Ensure all changes are committed and pushed.

Create a new Git tag (e.g., v8):
```bash
git tag v8
git push origin v8
```
If needed, delete a tag:
```bash
git tag --delete v5
git push --delete origin v5
```
# 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

# 🙏 Acknowledgements

- Inspired by the need for more constructive code reviews.
- Powered by Gemini AI for intelligent comment sanitization.
