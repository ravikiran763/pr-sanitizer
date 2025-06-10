"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const sanitizer_ai_1 = require("./sanitizer-ai");
async function run() {
    try {
        // Get the inputs defined in action.yml and passed from the workflow
        const token = core.getInput('token', { required: true });
        const openaiApiKey = core.getInput('openaiApiKey', { required: true });
        const pr = core.getInput('pr', { required: true });
        const repoURL = core.getInput('repo', { required: true });
        const [owner, repo] = repoURL.split('/');
        // Convert 'pr' to a number as it will be a string from getInput
        const prNumber = parseInt(pr, 10);
        if (isNaN(prNumber)) {
            core.setFailed('Invalid PR number provided.');
            return;
        }
        core.info(`Received token: ${token ? token : 'N/A'}`); // Log token safely
        core.info(`Received OpenAI API Key: ${openaiApiKey ? openaiApiKey : 'N/A'}`); // Log API key safely
        core.info(`Received PR number: ${prNumber}`);
        core.info(`Received repositoryURL: ${repoURL}`);
        core.info(`Received Repo: ${repo}`);
        core.info(`Received Owner: ${owner}`);
        // Your action's logic goes here, using the extracted inputs
        // For example:
        // await sanitizePullRequest(token, openaiApiKey, prNumber, repo);
        (0, sanitizer_ai_1.sanitizeComments)({
            owner,
            repo,
            prNumber: parseInt(pr),
            token: token,
            openaiApiKey: openaiApiKey
        });
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
