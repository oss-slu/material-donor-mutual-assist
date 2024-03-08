# Database setup steps

Open terminal and navigate to folder docker-files\database where the docker-compose file is located

Run docker-compose up to bring the database up

Run "npx sequelize-cli init"

Run "npx sequelize-cli migration:generate --name=create_admin_table"

