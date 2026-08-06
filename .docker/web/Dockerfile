FROM oven/bun:1.3.14 AS builder

WORKDIR /work

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

FROM oven/bun:1.3.14 AS production

WORKDIR /work

COPY --from=builder /work/packages/web/build /work/build

ENV NODE_ENV=production

CMD ["bun", "run", "./build"]
