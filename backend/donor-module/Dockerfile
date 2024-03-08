FROM node:21-alpine

WORKDIR /app/donor-module

COPY package.json /app/donor-module/
COPY ./bin/www /app/donor-module/bin/
COPY ./node_modules /app/donor-module/node_modules/
COPY ./public /app/donor-module/public/
COPY ./routes /app/donor-module/routes/
# COPY ./src /app/donor-module/src/
COPY . /app/donor-module/
COPY package-lock.json /app/donor-module/
COPY README.md /app/donor-module/
COPY ./tests /app/donor-module/tests/
COPY ./views /app/donor-module/views/
COPY app.js /app/donor-module/
COPY . . 
RUN npm install
EXPOSE 5001
CMD ["npm", "start"]

