# Code Snippet Manager API

> 🤖 Built autonomously using **Ralph Loop + OpenAI Codex**

A REST API for managing code snippets with tagging, search, and CRUD operations.

## Prerequisites

Before running Ralph loop, install these tools:

```bash
# 1. Install OpenAI Codex CLI
npm i -g @openai/codex

# 2. Install Ralph CLI
npm i -g @iannuttall/ralph

# 3. Set your OpenAI API key
export OPENAI_API_KEY=your-api-key-here
```

## Quick Start

```bash
# 1. Navigate to project
cd ralph-codex-demo

# 2. Initialize git (required for Ralph)
git init
git add -A
git commit -m "Initial commit with PRD"

# 3. Generate implementation plan from PRD
ralph plan --agent=codex

# 4. Run Ralph loop - it will build the project automatically!
ralph build 5 --agent=codex
```

## How It Works

Ralph reads the PRD at `.agents/tasks/prd.md` and:

1. **Plans**: Breaks stories into concrete tasks
2. **Executes**: Works on one story per iteration
3. **Commits**: Saves progress to git after each story
4. **Repeats**: Fresh context each loop, git = memory

## Commands Reference

| Command | Description |
|---------|-------------|
| `ralph plan --agent=codex` | Generate implementation plan |
| `ralph build 1 --agent=codex` | Run 1 iteration |
| `ralph build 5 --agent=codex` | Run 5 iterations |
| `ralph build 1 --no-commit` | Dry run (no commits) |

## Project Structure

```
ralph-codex-demo/
├── .agents/
│   ├── ralph/
│   │   └── config.sh         # Ralph configuration
│   └── tasks/
│       └── prd.md            # Product Requirements ✅
├── .ralph/                   # State files (auto-created)
│   ├── IMPLEMENTATION_PLAN.md
│   ├── progress.md
│   └── runs/
├── src/                      # Source code (built by Ralph)
├── package.json
├── setup.sh                  # Setup helper script
└── README.md
```

## The PRD

The PRD defines 10 user stories:

1. ✅ Project Setup
2. ✅ Database Schema  
3. ✅ Create Snippet Endpoint
4. ✅ Get All Snippets Endpoint
5. ✅ Get Single Snippet Endpoint
6. ✅ Update Snippet Endpoint
7. ✅ Delete Snippet Endpoint
8. ✅ Search Endpoint
9. ✅ API Tests
10. ✅ Documentation

Ralph will work through each story, one iteration at a time.

## API Endpoints (After Build)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/snippets | Create snippet |
| GET | /api/snippets | List all snippets |
| GET | /api/snippets/:id | Get single snippet |
| PUT | /api/snippets/:id | Update snippet |
| DELETE | /api/snippets/:id | Delete snippet |
| GET | /api/snippets/search?q= | Search snippets |

## Tips

- **Start small**: Run `ralph build 1` first to see how it works
- **Watch costs**: Each iteration uses API tokens
- **Check progress**: Look at `.ralph/progress.md` between runs
- **Debug issues**: Check `.ralph/runs/` for detailed logs

## License

MIT
