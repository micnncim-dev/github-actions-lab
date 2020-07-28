FROM alpine:3.12

ENV GIT_CHGLOG_VERSION=0.9.1

RUN apk add --no-cache git \
    && wget -O git-chglog https://github.com/git-chglog/git-chglog/releases/download/0.9.1/git-chglog_linux_amd64 \
    && mv git-chglog /usr/local/bin \
    && chmod +x /usr/local/bin/git-chglog

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
