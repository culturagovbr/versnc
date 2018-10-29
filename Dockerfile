FROM mhart/alpine-node:8

WORKDIR /source

RUN npm install yarn

COPY start.sh /source/.

COPY package.json /source/.

RUN chmod +x start.sh

CMD /source/start.sh

