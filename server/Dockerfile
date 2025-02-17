# Use the latest LTS version of Node.js
FROM node:18
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./

# suggestion
COPY prisma ./prisma/
 
# Install dependencies
RUN npm install
 
# Copy the rest of your application files
COPY . .

#RUN npx prisma generate
# 
 
# Expose the port your app runs on
EXPOSE 5050
 
# Define the command to run your app
CMD ["npm", "run", "dev"]