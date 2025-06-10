#!/usr/bin/env node

import { sanitizeComments } from "./sanitizer-ai";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const [owner, repo] = (args.repo || "").split("/");

if (!args.repo || !args.pr || !args.token) {
  console.error("Usage: pr-sanitizer --repo owner/repo --pr 1 --token YOUR_GITHUB_TOKEN", args);
  console.error(process.argv);
  process.exit(1);
}

sanitizeComments({
  owner,
  repo,
  prNumber: parseInt(args.pr),
  token: args.token,
  openaiApiKey: args.openaiApiKey
});
