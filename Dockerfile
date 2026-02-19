# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build TypeScript + Vite
RUN npm run build


# ---- Runtime stage ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4173

RUN printf 'server {\n  listen 4173;\n  location / {\n    root /usr/share/nginx/html;\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
