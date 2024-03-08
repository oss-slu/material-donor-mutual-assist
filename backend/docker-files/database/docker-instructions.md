# Database setup steps

Open terminal and navigate to folder docker-files\database where the docker-compose file is located

Run docker-compose up to run the container "mdma-database-container" and image "mdma-database-image"

In a new cmd window run "docker exec -it mdma-database-container psql -U admin -d mdma" to start the database