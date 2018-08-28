FROM node:10.9-alpine
LABEL maintainer="ball6847@gmail.com"

WORKDIR /src
COPY ./ /src

RUN npm install && \
    npm run build && \
    npm install -g file:. && \
    rm -rf node_modules
