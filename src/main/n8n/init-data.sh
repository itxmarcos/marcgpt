#!/bin/bash
set -e

# Create a non-root PostgreSQL user for n8n (principle of least privilege)
# This script runs once when the PostgreSQL container is first initialized

if [ -n "${POSTGRES_NON_ROOT_USER:-}" ] && [ -n "${POSTGRES_NON_ROOT_PASSWORD:-}" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE USER ${POSTGRES_NON_ROOT_USER} WITH PASSWORD '${POSTGRES_NON_ROOT_PASSWORD}';
        GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_NON_ROOT_USER};
        GRANT CREATE ON SCHEMA public TO ${POSTGRES_NON_ROOT_USER};
EOSQL
    echo "Non-root user ${POSTGRES_NON_ROOT_USER} created successfully."
else
    echo "WARNING: POSTGRES_NON_ROOT_USER or POSTGRES_NON_ROOT_PASSWORD not set. Skipping."
fi
