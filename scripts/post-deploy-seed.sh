#!/bin/bash
# Post-deploy seed script for Vercel
# This runs after the build completes

echo "Running post-deploy seed..."

# Check if environment variables are set
if [ -z "$ADMIN_SEED_EMAIL" ] || [ -z "$ADMIN_SEED_PASSWORD" ]; then
  echo "Skipping seed: ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD not set"
  exit 0
fi

# Use DIRECT_DATABASE_URL for seeding
export DATABASE_URL="$DIRECT_DATABASE_URL"

# Run the seed
npm run db:seed || echo "Seed failed, but continuing deployment"

