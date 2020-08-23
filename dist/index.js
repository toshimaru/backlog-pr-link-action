"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput("repo-token", { required: true });
            if (github_1.context.payload.pull_request === undefined) {
                throw new Error("Can't get pull_request payload. Check you trigger pull_request event");
            }
            const { assignees, number, user: { login: author, type } } = github_1.context.payload.pull_request;
            if (assignees.length > 0) {
                core.info(`Assigning author has been skipped since the pull request is already assigned to someone`);
                return;
            }
            if (type === 'Bot') {
                core.info("Assigning author has been skipped since the author is a bot");
                return;
            }
            const octokit = github_1.getOctokit(token);
            const result = yield octokit.issues.addAssignees({
                owner: github_1.context.repo.owner,
                repo: github_1.context.repo.repo,
                issue_number: number,
                assignees: [author]
            });
            core.debug(JSON.stringify(result));
            core.info(`@${author} has been assigned to the pull request: #${number}`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
