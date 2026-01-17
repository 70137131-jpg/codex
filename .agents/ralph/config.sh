#!/bin/bash
# Ralph configuration for this project

# Default agent: OpenAI Codex
# Options: codex, claude, droid, opencode
DEFAULT_AGENT="codex"

# Agent command (Codex in YOLO mode for autonomous execution)
AGENT_CMD="codex exec --yolo -"

# Maximum iterations before stopping
MAX_ITERATIONS=10

# Auto-commit after each successful iteration
AUTO_COMMIT=true

# PRD and plan paths (defaults)
PRD_PATH=".agents/tasks/prd.md"
PLAN_PATH=".ralph/IMPLEMENTATION_PLAN.md"
PROGRESS_PATH=".ralph/progress.md"
