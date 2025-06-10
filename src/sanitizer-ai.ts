import { Octokit } from "@octokit/rest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RestEndpointMethodTypes } from '@octokit/rest';

// Ask Gemini AI if the comment should be rewritten and how
export async function analyzeAndRewriteCommentGemini(
  genAI: GoogleGenerativeAI,
  comment: string,
  lineContents: string
): Promise<{ rewrite: boolean; sanitized?: string; tip?: string; recommendation?: string }> {
  const prompt = `
You're a professional and respectful code reviewer. Review the following GitHub PR comment and context where this comment was made and decide whether it needs to be rewritten to improve clarity, tone, mask PI information in the comments, or professionalism:

---
Comment :"${comment}"
---

---
Context :"${lineContents}"
---

Respond in JSON with:
- rewrite: true or false
- sanitized: the improved version (only if rewrite is true)
- tip: an optional tip for the developer (optional)
- recommendation: a code snippet to resolve the issue (optional)

Example:
{
  "rewrite": true,
  "sanitized": "Consider refactoring this method to make it more modular and testable.",
  "tip": "Break large functions into smaller reusable units."
  "recommendation": "log.error('An error occurred');"
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
  } catch {
    console.warn("⚠️ Failed to parse response from Gemini AI:", output);
    return { rewrite: false };
  }
}

export async function sanitizeComments(params: {
  owner: string;
  repo: string;
  prNumber: number;
  token: string;
  openaiApiKey: string;
}) {
  const { owner, repo, prNumber, token, openaiApiKey } = params;
  const octokit = new Octokit({ auth: token });

  const genAI = new GoogleGenerativeAI(openaiApiKey);

  const reviews = await octokit.pulls.listReviewComments({
    owner,
    repo,
    pull_number: prNumber
  });

  for (const review of reviews.data) {
    const body = review.body;
    if (!body) continue;

    const lineContents = await getCommentedLineContent(octokit, owner, repo, review);

    const { rewrite, sanitized, tip, recommendation } = await analyzeAndRewriteCommentGemini(genAI, body, lineContents);

    if (rewrite && sanitized) {
      console.log(`🔁 Rewriting comment by ${review.user?.login}`);
      console.log(`Original: ${body}`);
      console.log(`Rewritten: ${sanitized}`);
      if (tip) console.log(`💡 Tip: ${tip}`);
      if (recommendation) console.log(`💡 Recommendation: ${recommendation}`);

      const newBody = `${sanitized}` +
        `${tip ? `\n\n💡 *Tip for author:* ${tip}` : ""}` +
        `${recommendation ? `\n\n💡 *Recommendation for author:*\n\`\`\`\n${recommendation}\n\`\`\`` : ""}`;

      await octokit.pulls.updateReviewComment({
        owner,
        repo,
        comment_id: review.id,
        body: newBody
      });
    }
  }
}

export async function getCommentedLineContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  comment: RestEndpointMethodTypes['pulls']['listReviewComments']['response']['data'][0]
): Promise<string> {
  const filePath = comment.path;
  const commitSha = comment.original_commit_id || comment.commit_id;

  if (!filePath || !commitSha) {
    console.warn(`Skipping file content retrieval for comment ${comment.id} due to missing file path or commit SHA.`);
    return "";
  }

  try {
    console.info(`  Attempting to get file content for ${filePath} at commit ${commitSha.substring(0, 7)}...`);
    const { data: fileContentResponse } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: commitSha, // Use the specific commit SHA to get the exact file version
    });

    // Ensure the content is available and is a file
    if ('content' in fileContentResponse && fileContentResponse.type === 'file') {
      const encodedContent = fileContentResponse.content;
      const decodedContent = Buffer.from(encodedContent, 'base64').toString('utf8');

      console.info(`  Successfully retrieved content for ${filePath}.`);
      return decodedContent;
    } else {
      console.warn(`  Could not retrieve file content or it's not a file type for ${filePath} at ${commitSha.substring(0, 7)}.`);
      return "";
    }
  } catch (fileError: any) {
    console.error(`  Failed to get file content for ${filePath} at commit ${commitSha.substring(0, 7)}: ${fileError.message}`);
    if (fileError.status === 404) {
      console.warn('  This might happen if the file was deleted or the specific commit is no longer accessible.');
    }
    return "";
  }
}
