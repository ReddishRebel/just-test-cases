FROM node:22-alpine AS build

WORKDIR /app

COPY packages/client packages/client

WORKDIR /app/packages/client
RUN npm install && npm run build

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PUBLIC_PATH=/app/packages/public
ENV PORT=8000
ENV HOST=127.0.0.1

COPY packages/server packages/server
COPY --from=build /app/packages/client/dist /app/packages/public

WORKDIR /app/packages/server
RUN npm install --omit=dev

EXPOSE 8000
CMD ["node", "src/index.js"]
