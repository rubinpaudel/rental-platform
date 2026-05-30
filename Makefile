.PHONY: help install dev dev-api build lint typecheck check stack-up stack-down stack-reset stack-logs migrate db-generate db-studio test-flows health setup docker-build clean worktree-up worktree-down worktree-remove worktree-dash

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

install: ## Install workspace dependencies (frozen — fails if lockfile drifts)
	pnpm install --frozen-lockfile

setup: install stack-up ## Fresh start: install deps, bring up stack (no migrations until v1)
	@test -f .env.local || cp .env.example .env.local
	@until docker exec rental-postgres pg_isready -U rental -d rental >/dev/null 2>&1; do sleep 1; done

dev: stack-up ## Start dev stack and run all apps in watch mode
	pnpm dev

dev-api: stack-up ## Start dev stack and run only the API in watch mode
	pnpm dev:api

worktree-up: ## Create a worktree (from main repo) or provision this one (from inside)
	@bash scripts/worktree-up.sh

worktree-down: ## Stop dev, drop DB, clean state for this worktree
	@bash scripts/worktree-down.sh

worktree-remove: ## Tear down a worktree and `git worktree remove` it (run from main repo)
	@bash scripts/worktree-remove.sh

worktree-dash: ## Run the worktree dashboard at http://localhost:4999
	@node scripts/worktree-dashboard.mjs

build: ## Build every package/app
	pnpm build

lint: ## Lint every package/app
	pnpm lint

typecheck: ## Typecheck every package/app
	pnpm typecheck

check: ## Build, lint, typecheck, test everything (CI gate)
	pnpm turbo run build lint typecheck test

stack-up: ## Bring up Postgres + MinIO (S3)
	pnpm stack:up

stack-down: ## Stop the dev stack
	pnpm stack:down

stack-reset: ## Wipe volumes and restart (fresh DB + empty bucket)
	pnpm stack:reset

stack-logs: ## Tail dev stack logs
	pnpm stack:logs

migrate: ## Apply pending DB migrations
	pnpm db:migrate

db-generate: ## Generate a Drizzle migration — usage: make db-generate NAME=create_<table>
ifndef NAME
	$(error NAME is required. Usage: make db-generate NAME=create_<table>)
endif
	pnpm --filter @rental-platform/db db:generate --name=$(NAME)

db-studio: ## Open Drizzle Studio (web UI for DB inspection)
	pnpm db:studio

test-flows: ## Run the Bruno API suite headless (needs API + stack running)
	cd tools/test-flows/bruno && pnpm dlx @usebruno/cli@latest run . --env local

health: ## Curl the local API health endpoint
	curl -s -w '\n' http://localhost:4000/health

docker-build: ## Build the API deploy image (mirrors Railway)
	docker build -f apps/api/Dockerfile -t rental-api:local .

clean: ## Remove node_modules and wipe Docker volumes
	pnpm clean
	pnpm stack:reset
