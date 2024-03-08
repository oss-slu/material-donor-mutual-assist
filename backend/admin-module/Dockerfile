FROM nats:latest AS nats
FROM node:21-alpine


WORKDIR /app/admin-module

COPY package.json /app/admin-module/
COPY ./bin/www /app/admin-module/bin/
COPY ./node_modules /app/admin-module/node_modules/
COPY ./public /app/admin-module/public/
COPY ./routes /app/admin-module/routes/
# COPY ./src /app/admin-module/src/
COPY . /app/admin-module/
COPY package-lock.json /app/admin-module/
COPY README.md /app/admin-module/
COPY ./tests /app/admin-module/tests/
COPY ./views /app/admin-module/views/
COPY app.js /app/admin-module/
COPY . . 
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]

