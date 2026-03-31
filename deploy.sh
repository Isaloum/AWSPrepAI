#!/bin/bash
# ─────────────────────────────────────────────
# AWSPrepAI — Safe Deploy Script
# RULE: /tmp/awsprep_push is the ONLY source of truth.
#       NEVER rsync from mnt/AWSPrepAI → repo.
#       Always edit files IN /tmp/awsprep_push, then push.
# Usage: bash deploy.sh "commit message"
# ─────────────────────────────────────────────
set -e
MSG="${1:-Auto deploy}"
REPO_DIR="/tmp/awsprep_push"

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "❌ Repo not found at $REPO_DIR. Run: git clone https://github.com/Isaloum/AWSPrepAI.git $REPO_DIR"
  exit 1
fi

cd "$REPO_DIR"
git pull origin master

git add -A
git diff --cached --quiet && echo "✅ Nothing to commit." && exit 0
git commit -m "$MSG"
git push origin master
git push origin master:main
echo "✅ Pushed to GitHub Pages + Netlify"
