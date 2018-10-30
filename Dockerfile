FROM node:8-alpine

WORKDIR /source

COPY . /source/

RUN yarn install --prod

VOLUME /source
