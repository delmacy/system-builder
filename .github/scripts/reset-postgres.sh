#!/usr/bin/env bash
set -euo pipefail

# Recreate the verification Postgres databases so a subsequent `npm run verify`
# runs against a clean server. The product Postgres E2E tests are not
# idempotent: they use fixed table names and assume a clean database, so any
# earlier `npm run verify` inside the same job pollutes the shared service and
# makes a second run fail with duplicate-identity errors.
cat > /tmp/reset-postgres.ts <<'EOF'
import { postgresQuery } from "./packages/postgres/index.ts";
const databases = [
  { admin: "postgres://system_builder@127.0.0.1:5432/postgres", name: "system_builder" },
  { admin: "postgres://deploy_auth:ci-test-password@127.0.0.1:5433/postgres", name: "system_builder_auth" },
];
for (const { admin, name } of databases) {
  await postgresQuery(admin, `DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
  await postgresQuery(admin, `CREATE DATABASE "${name}"`);
}
EOF
npx tsx /tmp/reset-postgres.ts
