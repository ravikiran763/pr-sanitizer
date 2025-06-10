"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAndRewriteCommentGemini = analyzeAndRewriteCommentGemini;
exports.sanitizeComments = sanitizeComments;
const rest_1 = require("@octokit/rest");
const generative_ai_1 = require("@google/generative-ai");
// Ask Gemini AI if the comment should be rewritten and how
async function analyzeAndRewriteCommentGemini(genAI, comment) {
    const prompt = `
You're a professional and respectful code reviewer. Review the following GitHub PR comment and decide whether it needs to be rewritten to improve clarity, tone, or professionalism:

---
"${comment}"
---

Respond in JSON with:
- rewrite: true or false
- sanitized: the improved version (only if rewrite is true)
- tip: an optional tip for the developer (optional)

Example:
{
  "rewrite": true,
  "sanitized": "Consider refactoring this method to make it more modular and testable.",
  "tip": "Break large functions into smaller reusable units."
}
`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    // Strip Markdown code block if present
    if (output.startsWith("```")) {
        output = output.replace(/^```(?:json)?\s*|\s*```$/g, "");
    }
    try {
        return JSON.parse(output);
    }
    catch {
        console.warn("⚠️ Failed to parse response from Gemini AI:", output);
        return { rewrite: false };
    }
}
async function sanitizeComments(params) {
    const { owner, repo, prNumber, token, openaiApiKey } = params;
    const octokit = new rest_1.Octokit({ auth: token });
    const genAI = new generative_ai_1.GoogleGenerativeAI(openaiApiKey);
    const reviews = await octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: prNumber
    });
    for (const review of reviews.data) {
        const body = review.body;
        if (!body)
            continue;
        const { rewrite, sanitized, tip } = await analyzeAndRewriteCommentGemini(genAI, body);
        if (rewrite && sanitized) {
            console.log(`🔁 Rewriting comment by ${review.user?.login}`);
            console.log(`Original: ${body}`);
            console.log(`Rewritten: ${sanitized}`);
            if (tip)
                console.log(`💡 Tip: ${tip}`);
            const newBody = `${sanitized}${tip ? `\n\n💡 *Tip for author:* ${tip}` : ""}`;
            await octokit.pulls.updateReviewComment({
                owner,
                repo,
                comment_id: review.id,
                body: newBody
            });
        }
    }
}
