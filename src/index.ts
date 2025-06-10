import * as core from '@actions/core';
import { sanitizeComments } from "./sanitizer-ai";

async function run() {
  try {
    // Get the inputs defined in action.yml and passed from the workflow
    const token = core.getInput('token', { required: true });
    const openaiApiKey = core.getInput('openaiApiKey', { required: true });
    const pr = core.getInput('pr', { required: true });
    const repo = core.getInput('repo', { required: true });
    const [owner, repoName] = repo.split('/');

    // Convert 'pr' to a number as it will be a string from getInput
    const prNumber = parseInt(pr, 10);
    if (isNaN(prNumber)) {
      core.setFailed('Invalid PR number provided.');
      return;
    }

    core.info(`Received token: ${token ? '******' : 'N/A'}`); // Log token safely
    core.info(`Received OpenAI API Key: ${openaiApiKey ? '******' : 'N/A'}`); // Log API key safely
    core.info(`Received PR number: ${prNumber}`);
    core.info(`Received repository: ${repo}`);

    // Your action's logic goes here, using the extracted inputs
    // For example:
    // await sanitizePullRequest(token, openaiApiKey, prNumber, repo);
    sanitizeComments({
      owner,
      repo,
      prNumber: parseInt(pr),
      token: token,
      openaiApiKey: openaiApiKey
    });

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();