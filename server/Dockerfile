FROM node:18
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
EXPOSE 5050
CMD ["npm", "run", "dev"]