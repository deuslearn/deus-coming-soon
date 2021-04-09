FROM node:current-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=8080
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm i --production --no-update-notifier && mv node_modules ../

COPY . .

EXPOSE 8080

CMD npm start