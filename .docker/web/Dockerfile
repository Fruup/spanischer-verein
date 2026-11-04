FROM oven/bun:1.4 AS builder

WORKDIR /work

ARG ORIGIN
ENV ORIGIN=${ORIGIN}
ARG HOSTINGER_MAIL_API_TOKEN
ENV HOSTINGER_MAIL_API_TOKEN=${HOSTINGER_MAIL_API_TOKEN}
ARG HOSTINGER_MAIL_ADDRESS
ENV HOSTINGER_MAIL_ADDRESS=${HOSTINGER_MAIL_ADDRESS}
ARG HOSTINGER_MAIL_SENDER
ENV HOSTINGER_MAIL_SENDER=${HOSTINGER_MAIL_SENDER}
ARG ADMIN_MAIL_ADDRESS
ENV ADMIN_MAIL_ADDRESS=${ADMIN_MAIL_ADDRESS}
ARG ALTCHA_SECRET
ENV ALTCHA_SECRET=${ALTCHA_SECRET}

# Add dependencies and install
ADD package.json bun.lock ./
ADD packages/web/package.json ./packages/web/
ADD packages/sanity/package.json ./packages/sanity/

# RUN cd web && bun install --frozen-lockfile
RUN bun install --frozen-lockfile

# Add sources and build
ADD packages/web ./packages/web
ADD packages/sanity ./packages/sanity

RUN cd packages/web && bun run build

FROM oven/bun:1.4 AS production

WORKDIR /work

ENV NODE_ENV=production

COPY --from=builder /work/packages/web/build /work/packages/web/build
COPY --from=builder /work/packages/web/package.json /work/packages/web/
COPY --from=builder /work/bun.lock /work/

RUN bun install --cwd packages/web --frozen-lockfile --production

CMD ["bun", "run", "--cwd", "./packages/web", "./build"]
