FROM node:alpine

WORKDIR /opt/helloworldservice
COPY . /opt/helloworldservice

RUN npm install

ENTRYPOINT ["npm", "start"]
