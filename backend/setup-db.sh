#!/bin/bash

# Create PostgreSQL user if it doesn't exist
echo "Creating PostgreSQL user 'postgres' with password 'postgres'..."
createuser -s postgres || true

# Set password for the postgres user
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';" || true

# Create the database if it doesn't exist
echo "Creating database 'motorbike_store'..."
createdb -U postgres motorbike_store || true

# Run the initialization script
echo "Running database initialization script..."
psql -U postgres -d motorbike_store -f src/db/init.sql

# Update brand logos
echo "Updating brand logos..."
psql -U postgres -d motorbike_store -f src/db/update_brand_logos.sql

echo "Database setup completed!" 