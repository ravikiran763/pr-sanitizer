import { Octokit } from "@octokit/rest";

const OFFENSIVE_WORDS = ["trash", "stupid", "idiot", "dumb", "wtf"];

export function isOffensive(comment: string): boolean {
  const lowered = comment.toLowerCase();
  return OFFENSIVE_WORDS.some(word => lowered.includes(word));
}

export function rewriteComment(comment: string): { sanitized: string; tip?: string } {
  if (comment.toLowerCase().includes("trash")) {
    return {
      sanitized: "This implementation could benefit from improved structure. Consider refactoring.",
      tip: "Try breaking large functions into smaller, testable parts."
    };
  }
  return { sanitized: comment };
}

export async function sanitizeComments(params: {
  owner: string;
  repo: string;
  prNumber: number;
  token: string;
}) {
  const { owner, repo, prNumber, token } = params;
  const octokit = new Octokit({ auth: token });

  const reviews = await octokit.pulls.listReviewComments({
    owner,
    repo,
    pull_number: prNumber
  });
  console.log(JSON.stringify(reviews, null, 2));
  for (const review of reviews.data) {

    if (review.body && isOffensive(review.body)) {
      const { sanitized, tip } = rewriteComment(review.body);
      console.log(`🛑 Offensive comment by ${review.user?.login}`);
      console.log(`Original: ${review.body}`);
      console.log(`Sanitized: ${sanitized}`);
      if (tip) console.log(`💡 Tip: ${tip}`);

//       await octokit.issues.updateReviewComment({
//         owner,
//         repo,
//         issue_number: prNumber,
//         body: `@${review.user?.login} — Here's a suggested revision of your review comment:
//
// > ${sanitized}${tip ? `
//
// 💡 *Tip for author:* ${tip}` : ""}`
//       });
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
