FROM node:18.15.0

WORKDIR /facebook-api-system
COPY package.json .
RUN npm install
COPY . .
CMD npm start

