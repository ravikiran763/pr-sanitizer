#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanitizer_ai_1 = require("./sanitizer-ai");
const minimist_1 = __importDefault(require("minimist"));
const args = (0, minimist_1.default)(process.argv.slice(2));
const [owner, repo] = (args.repo || "").split("/");
if (!args.repo || !args.pr || !args.token) {
    console.error("Usage: pr-sanitizer --repo owner/repo --pr 123 --token YOUR_GITHUB_TOKEN", args);
    process.exit(1);
}
(0, sanitizer_ai_1.sanitizeComments)({
    owner,
    repo,
    prNumber: parseInt(args.pr),
    token: args.token,
    openaiApiKey: args.openaiApiKey
});
