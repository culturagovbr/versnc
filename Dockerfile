FROM mhart/alpine-node:8

WORKDIR /source

COPY . /source/

RUN npm install -g npm@latest yarn && yarn install --prod

VOLUME /source
