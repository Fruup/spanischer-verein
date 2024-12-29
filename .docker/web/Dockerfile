FROM oven/bun:latest as builder

WORKDIR /work

# Add dependencies and install
ADD package.json bun.lockb ./
ADD packages/web/package.json ./packages/web/
ADD packages/sanity/package.json ./packages/sanity/

RUN cd packages/web && bun install

# Add sources and build
ADD packages/web ./packages/web
ADD packages/sanity ./packages/sanity

RUN cd packages/web && bun run build

FROM oven/bun:latest as production

WORKDIR /work

COPY --from=builder /work/packages/web/build /work/build

ENV NODE_ENV=production

CMD bun run ./build
