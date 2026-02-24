# WORKFLOW_AUTO.md

This file documents the automatic startup and monitoring workflow the assistant uses in this workspace.

1. Purpose
- Provide a stable, reproducible startup procedure after memory compaction or session reset.
- Ensure required services (OpenClaw gateway, browser control, scheduled reporters) are started and checked.

2. Startup steps (automated)
- Step 1: Verify workspace and memory files exist. If any memory/YYYY-MM-DD.md file is missing for today, append an empty template entry.
- Step 2: Run `openclaw status --deep` and capture output to `workspace/logs/openclaw_status.log`.
- Step 3: Ensure OpenClaw gateway is running; if not, run `openclaw gateway start`.
- Step 4: Ensure browser control available: `openclaw browser status` and verify cdpReady: true. If not, restart gateway and re-check.
- Step 5: Run `openclaw channels status --probe` and capture network/channel health to `workspace/logs/channels_status.log`.
- Step 6: Collect `openclaw channels logs --channel telegram --lines 300` to `workspace/logs/telegram_raw.log` and produce a masked copy `telegram_masked.log`.
- Step 7: Check pairing list `openclaw pairing list` and automatically approve outstanding pairings only if the pairing code is already known and preapproved by the human (manual approval is default).
- Step 8: Start scheduled reporters as defined in `workspace/SCHEDULED_REPORTS.json` (if present). Default: 5-minute reporter until specified end time.

3. Scheduled reporter behavior
- Runs at configured interval (default 5m) and posts to the main chat channel. Each report includes:
  - Current progress on long-running tasks
  - Latest backtest summary (if running)
  - OpenClaw/Telegram channel health
  - System one-line status (mem/disk/net)
- Reporter should mask secrets and avoid including raw tokens or private keys.
- Reporter persists logs to `workspace/logs/reports.log`.

4. Failure and alerting
- On critical failures (gateway down, browser control unreachable, repeated errors in channel logs) the assistant:
  - Sends an immediate alert to the main chat
  - Saves diagnostic logs to `workspace/logs/diagnostics/` with timestamps
  - Pauses automated trading components until operator confirmation

5. Safe defaults for automated trading
- Paper mode by default
- Per-trade max: 2% (change only on explicit human instruction)
- Total exposure cap: 30% by default
- Daily loss limit: 2% of account balance
- Minimum liquidity filter: 24h traded value threshold (configurable)

6. Security and privacy
- Never print or store plain API tokens in chat or unencrypted files.
- Mask any token-like strings in logs before sending to chat.
- Keep `.env` and secrets out of git; include `.env.example` only.

7. Files
- workspace/memory/YYYY-MM-DD.md — daily notes (append-only)
- workspace/WORKFLOW_AUTO.md — this file
- workspace/SCHEDULED_REPORTS.json — optional schedule config
- workspace/logs/ — captured logs and reports

8. Manual override
- A human operator can stop reporters or services by sending commands in the chat: "중지" / "stop reporters" / "openclaw gateway restart".

9. Contact
- For escalations, operators should check `workspace/logs/diagnostics/` and run `openclaw logs --follow`.

Generated: 2026-02-22
