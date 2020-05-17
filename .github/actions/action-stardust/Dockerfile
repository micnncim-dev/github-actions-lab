FROM alpine:latest

RUN mkdir -p /tmp/stardust \
    wget -qO- https://github.com/micnncim/stardust/releases/download/${VERSION}/stardust_linux_x86_64.tar.gz | tar xvz -C /tmp/stardust \
    && mv /tmp/stardust/stardust /usr/local/bin \
    && cd / \
    && rm -rf /tmp/stardust

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
