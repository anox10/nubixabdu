const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const path = require("path");

const token = process.argv[2] || process.env.GITHUB_TOKEN;
const dir = path.resolve(__dirname, "..");

if (!token) {
  console.log("Usage: node push_github.js <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>");
  process.exit(1);
}

async function pushToGitHub() {
  console.log("🚀 Pushing CLINORA to https://github.com/anox10/nubixabdu.git (main branch)...");
  
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: "origin",
    ref: "main",
    force: true,
    onAuth: () => ({
      username: "anox10",
      password: token
    })
  });

  if (pushResult.ok) {
    console.log("✅ Successfully pushed to GitHub repository!");
    console.log("🔗 Repository URL: https://github.com/anox10/nubixabdu");
  } else {
    console.log("Push result:", pushResult);
  }
}

pushToGitHub().catch(err => {
  console.error("❌ Push failed:", err.message);
  process.exit(1);
});
