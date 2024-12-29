FROM oven/bun:latest as production

WORKDIR /work

# Add dependencies and install
ADD package.json bun.lockb ./
ADD packages/newsletter/package.json ./packages/newsletter/
ADD packages/sanity/package.json ./packages/sanity/

RUN bun install

# Add required sources.
ADD packages/newsletter ./packages/newsletter
ADD packages/sanity ./packages/sanity

WORKDIR /work/packages/newsletter

ENV NODE_ENV=production

# The actual command is to be issued from outside the container.
CMD sleep infinity
