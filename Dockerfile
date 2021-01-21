FROM node:14
MAINTAINER Tan <dilingcloud@gmail.com>
COPY dist node_modules package*.json /app/
COPY .env /app

ENV GCP_MONGODB_URL mongodb://host.docker.internal:27017/diling
WORKDIR /app
CMD [node,"/app/dist/src/index.js"]
