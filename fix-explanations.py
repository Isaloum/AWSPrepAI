#!/usr/bin/env python3
"""
fix-explanations.py
Completes truncated AWS exam explanations using Claude Haiku.
Run from: ~/Desktop/Projects/CertiPrepAI/
Requires: pip install anthropic
Set: export ANTHROPIC_API_KEY=sk-ant-...
"""

import json, os, time, re, sys

try:
    import anthropic
except ImportError:
    print("Missing: pip install anthropic")
    sys.exit(1)

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    print("Missing: export ANTHROPIC_API_KEY=sk-ant-...")
    sys.exit(1)

client = anthropic.Anthropic(api_key=API_KEY)

DATA_DIR = "react-app/public/data"
FILES_TO_FIX = ["saa-c03.json", "dop-c02.json"]

def is_truncated(text: str) -> bool:
    if not text:
        return False
    return text.strip()[-1] not in ['.', '!', '?', ')', ']']

def complete_explanation(q_text: str, options: list, correct_idx: int, partial: str) -> str:
    correct_option = options[correct_idx] if correct_idx < len(options) else ""
    prompt = f"""You are an AWS certification exam expert. Complete the following PARTIAL explanation for an exam question.

Question: {q_text}
Correct answer: {correct_option}

Partial explanation (complete this, do NOT repeat what's already written):
{partial}

Rules:
- Continue EXACTLY from where the text cuts off — do not repeat or rewrite
- Write 1-3 sentences max to finish the thought
- Stay focused on why the correct answer is right
- End with a period
- Return ONLY the completion text (no preamble)"""

    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return msg.content[0].text.strip()

def fix_file(filename: str):
    fpath = os.path.join(DATA_DIR, filename)
    progress_file = fpath + ".progress.json"

    with open(fpath) as f:
        data = json.load(f)

    # Load progress if resuming
    completed = {}
    if os.path.exists(progress_file):
        with open(progress_file) as f:
            completed = json.load(f)
        print(f"  Resuming — {len(completed)} already done")

    truncated_indices = [i for i, q in enumerate(data) if is_truncated(q.get("explain", ""))]
    total = len(truncated_indices)
    print(f"  {total} truncated explanations to fix")

    fixed = 0
    errors = 0

    for idx in truncated_indices:
        str_idx = str(idx)
        if str_idx in completed:
            data[idx]["explain"] = completed[str_idx]
            continue

        q = data[idx]
        partial = q.get("explain", "")

        try:
            completion = complete_explanation(
                q.get("q", ""),
                q.get("options", []),
                q.get("answer", 0),
                partial
            )
            # Append completion to partial (ensure no double-space)
            if partial and partial[-1] != " ":
                full = partial + " " + completion
            else:
                full = partial + completion

            data[idx]["explain"] = full
            completed[str_idx] = full
            fixed += 1

            # Save progress after every question
            with open(progress_file, "w") as f:
                json.dump(completed, f)

            done_count = len([k for k in completed])
            print(f"  [{done_count}/{total}] Q{idx+1} ✓", end="\r")

            # Rate limit: ~3 req/sec to stay safe
            time.sleep(0.35)

        except Exception as e:
            errors += 1
            print(f"\n  ⚠️  Q{idx+1} failed: {e}")
            time.sleep(2)  # Back off on error

    # Save final JSON
    with open(fpath, "w") as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    # Clean up progress file
    if os.path.exists(progress_file):
        os.remove(progress_file)

    print(f"\n  ✅ Done — {fixed} fixed, {errors} errors → saved {filename}")

def main():
    print("=== CertiPrepAI Explanation Fixer ===\n")
    for fname in FILES_TO_FIX:
        fpath = os.path.join(DATA_DIR, fname)
        if not os.path.exists(fpath):
            print(f"Skipping {fname} — not found")
            continue
        print(f"\n📄 Processing {fname}...")
        fix_file(fname)

    print("\n🎉 All done! Commit with:")
    print('  git add react-app/public/data/ && git commit -m "fix: complete truncated exam explanations via Claude Haiku" && git push origin main')

if __name__ == "__main__":
    main()
