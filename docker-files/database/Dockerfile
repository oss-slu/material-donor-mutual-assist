FROM postgres:16.2

COPY *.sql /docker-entrypoint-initdb.d/

# # Add createtable.sql script (if any)
# ADD init.sql /docker-entrypoint-initdb.d/
# ADD createtable.sql /docker-entrypoint-initdb.d

# # Set permissions for scripts (if any)
RUN chmod a+r /docker-entrypoint-initdb.d/*

# Optional: Add the script to create the table from the CSV data
EXPOSE 5432

CMD ["postgres", "-p", "5432"]