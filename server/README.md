# Development Setup

Follow these steps to set up your development environment.

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. If it's not installed, download and install it from [Node.js Official Website](https://nodejs.org/).

- **PostgreSQL**: Ensure that PostgreSQL is installed on your system. If it's not installed, download and install it from [PostgreSQL Official Website](https://www.postgresql.org/download/).

  > **Note**: During PostgreSQL installation, remember to note down the **username** and **password** you set for the PostgreSQL server. You will need these for setting up your `.env` file.

## Step-by-Step Setup

### 1. Set Up PostgreSQL

#### Option 1: Using the Terminal

- **Windows/Linux/Mac**:
  - Open your terminal or command prompt.
  - Run `psql` to enter the PostgreSQL command line interface.
  - Create a new database with the command:
    ```sql
    CREATE DATABASE dbname;
    ```
  - Replace `dbname` with the name you want to give your database.

#### Option 2: Using pgAdmin

- **pgAdmin**:
  - Open pgAdmin and connect to your PostgreSQL server.
  - Right-click on 'Databases', then select 'Create' -> 'Database'.
  - Enter the desired name for your database in the 'Database Name' field and save.

### 2. Create Environment Variables

Create a `.env` file in the root directory of your project and define the necessary environment variables:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
```

Replace `username`, `password`, and `dbname` with your PostgreSQL username, password, and the name of the database you created.

### 3. Install Dependencies

Run the following command in your project directory to install required dependencies:

    npm install

This command installs all the packages defined in your `package.json` file (both dependencies and devDependencies).

### 4. Run Migrations

To synchronize your database schema with your Prisma model and update the Prisma Client, run:

    npx prisma migrate dev

This command applies all pending migrations to your database and updates the Prisma Client to ensure it matches the new schema. This is crucial for keeping all developers' environments in sync with the latest database schema.

### 5. Start the Development Server

Start your development server by running:

    npm run dev

This command starts the server using `nodemon`, which will automatically restart the server if any changes are detected in your source files.

### 6. Access the Server

Once the server is running, it will be accessible at:

    http://localhost:5000

You can access your API endpoints via this URL using a web browser or tools like Postman for testing API requests.

## Additional Information

- **Keeping Schema in Sync**: It is important to run migrations whenever changes are made to your Prisma models. This keeps your database schema in sync with your application's data model (relevant commands will be added here soon).
- **Environment Variables**: Ensure that your `.env` file is never committed to your version control system. Add it to your `.gitignore` file to prevent it from being uploaded to shared repositories.
