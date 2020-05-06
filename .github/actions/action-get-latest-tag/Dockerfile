FROM alpine:latest

RUN apk add --no-cache grep git jq

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
