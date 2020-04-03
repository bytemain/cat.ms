FROM mhart/alpine-node:latest

LABEL maintainer="lengthmin<lengthmin@gmail.com>"

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
