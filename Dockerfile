FROM node:14-alpine
MAINTAINER Tan <dilingcloud@gmail.com>
WORKDIR /app
COPY dist ./dist/
COPY node_modules  ./node_modules/
COPY package*.json .env ./

ENV GCP_MONGODB_URL mongodb://host.docker.internal:27017/diling

CMD ["node","/app/dist/src/index.js"]
EXPOSE 3000/tcp