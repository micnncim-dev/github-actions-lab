FROM alpine:latest

RUN apk --no-cache add curl

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
