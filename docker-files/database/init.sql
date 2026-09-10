-- Runs once, on first initialisation of an empty data directory.
--
-- The superuser named by POSTGRES_USER (and its password) is already created
-- by the postgres image entrypoint before this script runs, so this file only
-- needs to create the application database.

CREATE DATABASE mdma;
