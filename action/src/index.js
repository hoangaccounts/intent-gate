const fs = require("fs");

const core = require("@actions/core");
const exec = require("@actions/exec");
const yaml = require("js-yaml");
const { minimatch } = require("minimatch");

async function run() {
  try {
    const intentPath = core.getInput("intent_path") || "intent.yml";

    if (!fs.existsSync(intentPath)) {
      core.setFailed(`IntentGate: intent file not found at ${intentPath}`);
      return;
    }

    const intent = yaml.load(fs.readFileSync(intentPath, "utf8")) || {};
    const forbidden = ((intent.forbidden || {}).paths || []).filter(Boolean);

    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (!eventPath || !fs.existsSync(eventPath)) {
      core.setFailed("IntentGate: missing GITHUB_EVENT_PATH (must run on pull_request).");
      return;
    }

    const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
    const pr = event.pull_request;

    if (!pr || !pr.base || !pr.head) {
      core.setFailed("IntentGate: workflow must run on pull_request events.");
      return;
    }

    const baseSha = pr.base.sha;
    const headSha = pr.head.sha;

    const changedFiles = [];
    const options = {
      listeners: {
        stdout: (data) => {
          for (const line of data.toString().split("\n")) {
            const trimmed = line.trim();
            if (trimmed.length > 0) changedFiles.push(trimmed);
          }
        },
      },
    };

    await exec.exec("git", ["diff", "--name-only", baseSha, headSha], options);

    const forbiddenHits = changedFiles.filter((file) =>
      forbidden.some((pattern) => minimatch(file, pattern, { dot: true })),
    );

    if (forbiddenHits.length > 0) {
      core.setFailed(
        `IntentGate: forbidden paths touched:\n${forbiddenHits.map((f) => `- ${f}`).join("\n")}`,
      );
      return;
    }

    core.info("IntentGate: PASS");
  } catch (e) {
    core.setFailed(`IntentGate: error: ${e && e.message ? e.message : String(e)}`);
  }
}

run();
