# ==========================
# Building the image
# ==========================
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================
# For prod
# ==========================
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/app.js"]
