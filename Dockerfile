FROM mhart/alpine-node:8

WORKDIR /source

COPY . /source/

RUN npm install yarn && yarn install

VOLUME /source/dist

CMD ["yarn", "run", "ng", "build", "--prod", "--source-map", "--env=prod", "&&", "chmod", "-R", "777", "/source/dist/*"]
