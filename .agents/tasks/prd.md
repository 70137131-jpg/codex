# PRD: Code Snippet Manager API

## Overview
A REST API for managing code snippets with syntax highlighting metadata, tagging, and search capabilities. Built with Node.js and Express.

## Tech Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: SQLite (via better-sqlite3)
- **Validation**: Zod
- **Testing**: Vitest

## User Stories

### Story 1: Project Setup
**As a** developer  
**I want** a properly configured Node.js project  
**So that** I can build the API with modern tooling

**Acceptance Criteria:**
- [ ] Initialize package.json with type: "module"
- [ ] Install dependencies: express, better-sqlite3, zod, uuid
- [ ] Install dev dependencies: vitest, supertest
- [ ] Create src/ directory structure
- [ ] Add npm scripts: start, dev, test
- [ ] Create .gitignore for node_modules and *.db

---

### Story 2: Database Schema
**As a** developer  
**I want** a SQLite database with proper schema  
**So that** snippets can be persisted

**Acceptance Criteria:**
- [ ] Create src/db.js with database initialization
- [ ] Create snippets table with columns: id, title, code, language, tags, created_at, updated_at
- [ ] Tags stored as JSON array
- [ ] Auto-create database file if not exists

---

### Story 3: Create Snippet Endpoint
**As a** user  
**I want** to create new code snippets via POST /api/snippets  
**So that** I can save my code

**Acceptance Criteria:**
- [ ] POST /api/snippets accepts JSON body
- [ ] Validate: title (required, string), code (required, string), language (required, string), tags (optional, array)
- [ ] Return 201 with created snippet including generated id
- [ ] Return 400 for validation errors with descriptive message

---

### Story 4: Get All Snippets Endpoint
**As a** user  
**I want** to list all snippets via GET /api/snippets  
**So that** I can browse my saved code

**Acceptance Criteria:**
- [ ] GET /api/snippets returns array of all snippets
- [ ] Support query param ?language=python to filter by language
- [ ] Support query param ?tag=api to filter by tag
- [ ] Return 200 with empty array if no snippets

---

### Story 5: Get Single Snippet Endpoint
**As a** user  
**I want** to get a specific snippet via GET /api/snippets/:id  
**So that** I can view snippet details

**Acceptance Criteria:**
- [ ] GET /api/snippets/:id returns single snippet
- [ ] Return 404 if snippet not found
- [ ] Return full snippet object with all fields

---

### Story 6: Update Snippet Endpoint
**As a** user  
**I want** to update snippets via PUT /api/snippets/:id  
**So that** I can modify my saved code

**Acceptance Criteria:**
- [ ] PUT /api/snippets/:id accepts JSON body
- [ ] Allow partial updates (only provided fields updated)
- [ ] Update updated_at timestamp
- [ ] Return 200 with updated snippet
- [ ] Return 404 if snippet not found

---

### Story 7: Delete Snippet Endpoint
**As a** user  
**I want** to delete snippets via DELETE /api/snippets/:id  
**So that** I can remove unwanted code

**Acceptance Criteria:**
- [ ] DELETE /api/snippets/:id removes snippet
- [ ] Return 204 on successful deletion
- [ ] Return 404 if snippet not found

---

### Story 8: Search Endpoint
**As a** user  
**I want** to search snippets via GET /api/snippets/search?q=keyword  
**So that** I can find code quickly

**Acceptance Criteria:**
- [ ] GET /api/snippets/search?q=keyword searches title and code
- [ ] Case-insensitive search
- [ ] Return matching snippets array
- [ ] Return 400 if q parameter missing

---

### Story 9: API Tests
**As a** developer  
**I want** comprehensive API tests  
**So that** I can ensure reliability

**Acceptance Criteria:**
- [ ] Test all CRUD endpoints
- [ ] Test validation errors
- [ ] Test 404 cases
- [ ] Test search functionality
- [ ] All tests pass with `npm test`

---

### Story 10: Documentation
**As a** developer  
**I want** a README with API documentation  
**So that** users know how to use the API

**Acceptance Criteria:**
- [ ] README.md with project description
- [ ] Installation instructions
- [ ] API endpoint documentation with examples
- [ ] Example curl commands for each endpoint

---

## Non-Functional Requirements
- All endpoints return JSON
- Use proper HTTP status codes
- Handle errors gracefully with error messages
- Code should be clean and well-organized

## Definition of Done
When all user stories have their acceptance criteria checked off and `npm test` passes, output:
```
<promise>COMPLETE</promise>
```
