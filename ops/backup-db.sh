#!/bin/sh
set -eu

REPO=/home/yuichirork/chiikawa-web
BACKUP_DIR="$REPO/backend/database/backups"
STAMP=$(date -u +%Y%m%d-%H%M%S)
TARGET="/app/database/backups/chiikawa-$STAMP.db"

mkdir -p "$BACKUP_DIR"
cd "$REPO"

# VACUUM INTO creates a consistent snapshot, including data in SQLite WAL files.
docker compose exec -T backend node -e "const sqlite3=require('sqlite3').verbose(); const db=new sqlite3.Database('/app/database/sqlite.db'); db.run(\"VACUUM INTO '$TARGET'\", (error) => { if (error) { console.error(error.message); process.exitCode=1; } db.close(); });"
find "$BACKUP_DIR" -type f -name 'chiikawa-*.db' -mtime +30 -delete
