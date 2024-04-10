CREATE ROLE adminmd WITH LOGIN PASSWORD 'adminmd';

-- Create a new database
CREATE DATABASE mdma;

-- Give the admin user superuser privileges
ALTER ROLE admin WITH SUPERUSER;

-- Connect to the database
\c mdma;

\i /docker-entrypoint-initdb.d/table_admin.sql
\i /docker-entrypoint-initdb.d/table_donor.sql
\i /docker-entrypoint-initdb.d/table_inventory.sql