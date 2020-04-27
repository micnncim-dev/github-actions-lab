FROM alpine:latest

RUN apk --no-cache add bash curl

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
