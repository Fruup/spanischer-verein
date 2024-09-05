FROM oven/bun:latest as builder

WORKDIR /work

# Add dependencies and install
ADD package.json bun.lockb ./
ADD packages/web/package.json packages/web/bun.lockb ./web/
ADD packages/sanity/package.json packages/sanity/bun.lockb ./sanity/

RUN cd web && bun install

# Add sources and build
ADD packages/web ./web
ADD packages/sanity ./sanity

RUN cd web && bun run build

FROM oven/bun:latest as production

WORKDIR /work

COPY --from=builder /work/web/build /work/build

ENV NODE_ENV=production

CMD bun run ./build
