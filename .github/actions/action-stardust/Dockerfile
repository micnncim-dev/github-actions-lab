FROM alpine:latest

ENV STARDUST_VERSION=v0.3.0

RUN mkdir -p /tmp/stardust \
    && wget -qO- https://github.com/micnncim/stardust/releases/download/${STARDUST_VERSION}/stardust_linux_x86_64.tar.gz | tar xvz -C /tmp/stardust \
    && mv /tmp/stardust/stardust /usr/local/bin \
    && cd / \
    && rm -rf /tmp/stardust

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
