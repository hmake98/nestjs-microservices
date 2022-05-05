FROM node:14.16.0-alpine

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN mkdir -p /var/www/files
WORKDIR /var/www/files
ADD . /var/www/files
RUN npm install
CMD npm start