# --- Stage 1: build the frontend ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: runtime (Node server serving REST + WS + static frontend) ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV DB_PATH=/app/data/data.sqlite

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY --from=build /app/dist ./dist

# SQLite database lives here — mount a volume to persist it across restarts
RUN mkdir -p /app/data
VOLUME /app/data

EXPOSE 4000
CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.js"]
