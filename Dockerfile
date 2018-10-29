FROM mhart/alpine-node:8

WORKDIR /source

COPY . /source/

RUN npm install -g npm@latest && npm install yarn && yarn install

VOLUME /source/dist

CMD ["yarn", "run", "ng", "build", "--prod", "--env=prod"]
