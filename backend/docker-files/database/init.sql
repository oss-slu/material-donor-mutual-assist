-- Create a new role
CREATE ROLE adminmd WITH LOGIN PASSWORD 'adminmd';

-- Create a new database
CREATE DATABASE mdma;

-- Give the admin user superuser privileges
ALTER ROLE admin WITH SUPERUSER;

-- Connect to the database
\c mdma;
