FROM postgres:latest

# Set environment variable for database name
ENV DATABASE_NAME=mdma
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

# Command to run the postgres server
CMD ["postgres", "-p", "5432"]

# # Copy *.sql files (if any)
# COPY *.sql /docker-entrypoint-initdb.d/

# # Add createtable.sql script (if any)
# ADD init.sql /docker-entrypoint-initdb.d/
# ADD createtable.sql /docker-entrypoint-initdb.d

# # Set permissions for scripts (if any)
# RUN chmod a+r /docker-entrypoint-initdb.d/*

# Optional: Add the script to create the table from the CSV data
EXPOSE 5432
