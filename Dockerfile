FROM node:22-alpine AS dev

RUN apk update
RUN apk add openssl
RUN mkdir -p /usr/local/share/ca-certificates

ENV PATH="/application/node_modules/.bin:${PATH}"
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"
RUN apk add git ca-certificates bash sudo make build-base python3 libcap openssh
RUN update-ca-certificates
RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && chmod 0440 /etc/sudoers.d/node
RUN setcap cap_net_bind_service=+ep /usr/local/bin/node

CMD cd "/application" && if [ "$WATCH_FILES" == "1" ]; then NODE_OPTIONS=--inspect=0.0.0.0:9229 npm run start:dev; else node "dist/app.js"; fi
