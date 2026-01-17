#!/bin/bash

# ============================================
# Ralph Loop + Codex Setup Script
# ============================================

echo "🚀 Ralph Loop + Codex Project Setup"
echo "===================================="
echo ""

# Check if Codex is installed
if ! command -v codex &> /dev/null; then
    echo "❌ OpenAI Codex CLI not found!"
    echo "   Install it with: npm i -g @openai/codex"
    echo ""
    exit 1
else
    echo "✅ OpenAI Codex CLI found"
fi

# Check if Ralph is installed
if ! command -v ralph &> /dev/null; then
    echo "❌ Ralph CLI not found!"
    echo "   Install it with: npm i -g @iannuttall/ralph"
    echo ""
    exit 1
else
    echo "✅ Ralph CLI found"
fi

# Check for OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set!"
    echo "   Export it with: export OPENAI_API_KEY=your-key-here"
    echo ""
fi

echo ""
echo "📋 Project is ready! Here's how to run Ralph loop:"
echo ""
echo "  1. Initialize git (required for Ralph):"
echo "     git init && git add -A && git commit -m 'Initial commit'"
echo ""
echo "  2. Generate implementation plan:"
echo "     ralph plan --agent=codex"
echo ""
echo "  3. Run Ralph loop (1 iteration):"
echo "     ralph build 1 --agent=codex"
echo ""
echo "  4. Or run multiple iterations:"
echo "     ralph build 5 --agent=codex"
echo ""
echo "  5. Dry run (no commits):"
echo "     ralph build 1 --agent=codex --no-commit"
echo ""
echo "📁 Project Structure:"
echo "   .agents/tasks/prd.md    - Your PRD (Step 5 ✅)"
echo "   .agents/ralph/config.sh - Ralph config"
echo "   .ralph/                  - State files (created by Ralph)"
echo ""
echo "Happy coding! 🎉"
