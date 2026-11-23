# Tasks API

A small Node.js + MongoDB REST API (Express 5, Mongoose) with environment-specific
configuration for **staging**, **preprod** and **prod**, loaded dynamically at startup.

## Project structure

```
src/
├── app.js                  # Express app factory (no I/O, easy to test)
├── server.js               # Entry point: load config → connect DB → listen
├── config/
│   ├── index.js            # loadConfig(): picks the environment from NODE_ENV
│   └── env/
│       ├── staging.js
│       ├── preprod.js
│       └── prod.js
├── db/connection.js        # Mongoose connect / disconnect
├── models/task.model.js    # Task schema
├── services/task.service.js        # CRUD business logic
├── controllers/task.controller.js  # HTTP ↔ service mapping
├── routes/task.routes.js           # /api/tasks routes
├── middlewares/error-handler.js    # 404 + error → JSON response
└── utils/http-error.js
tests/                      # node:test + supertest + in-memory MongoDB
```

## Configuration

`NODE_ENV` selects the environment (`staging` | `preprod` | `prod`, default `staging`).
`src/config/index.js` then:

1. rejects any unknown environment,
2. loads `.env.<env>` from the project root if it exists (secrets, git-ignored),
3. dynamically imports `src/config/env/<env>.js` (non-secret defaults),
4. lets `PORT` and `MONGODB_URI` from the environment override those defaults.

`prod` has no default database URI, so `MONGODB_URI` must be set there.
See `.env.example` for the variables.

| Environment | Default port | Default database            |
| ----------- | ------------ | --------------------------- |
| staging     | 3001         | `tasks_staging` (localhost) |
| preprod     | 3002         | `tasks_preprod` (localhost) |
| prod        | 3000         | — (`MONGODB_URI` required)  |

## Running

```bash
npm install
cp .env.example .env.staging   # adjust MONGODB_URI if needed
npm run start:staging          # or start:preprod / start:prod
npm run dev                    # staging with auto-reload
```

## API

| Method | Path             | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/health`        | Health check                         |
| POST   | `/api/tasks`     | Create a task (`title` required)     |
| GET    | `/api/tasks`     | List tasks (optional `?status=done`) |
| GET    | `/api/tasks/:id` | Get one task                         |
| PATCH  | `/api/tasks/:id` | Update a task                        |
| DELETE | `/api/tasks/:id` | Delete a task                        |

A task has `title`, `description` and `status` (`todo` | `in-progress` | `done`).

## Quality

```bash
npm run lint
npm test
```

CI (`.github/workflows/ci.yml`) runs two jobs on every pull request:
`quality` (ESLint + commitlint on the PR's commits) and `build-and-test`.
Both are required status checks on `main`.

## Git workflow

This repository follows **Git Flow**:

| Branch       | Purpose                                                    |
| ------------ | ---------------------------------------------------------- |
| `main`       | Production-ready code. Protected: changes only through PRs |
| `develop`    | Integration branch for the next release                    |
| `feature/*`  | One feature each, branched from and merged into `develop`  |
| `docs/*`     | Documentation changes, same flow as features               |
| `release/*`  | Release preparation (version bump, changelog) → `main`     |
| `hotfix/*`   | Urgent fixes from `main`, merged back to `main` + `develop`|

Feature branches are merged with `--no-ff` so every feature stays visible in the history.
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/),
enforced locally by Husky + commitlint (`.husky/commit-msg`) and again in CI.
