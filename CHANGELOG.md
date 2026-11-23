# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-23

### Added

- Express application with `/health` endpoint.
- Environment-specific configuration for `staging`, `preprod` and `prod`, selected by `NODE_ENV`
  and loaded dynamically, with `.env.<env>` and `PORT` / `MONGODB_URI` overrides.
- MongoDB connection via Mongoose with graceful shutdown.
- `Task` model and CRUD endpoints under `/api/tasks`.
- Centralised error handling (404, validation errors, invalid JSON).
- Tests for the API and configuration loader using an in-memory MongoDB.
- CI workflow with `quality` and `build-and-test` jobs.
- Husky + commitlint enforcing Conventional Commits.
