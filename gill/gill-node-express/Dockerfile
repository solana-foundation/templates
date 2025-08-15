# LAYER 0: Base image
FROM node:22-alpine AS base

# Set the working directory for all images
WORKDIR /srv/api

# LAYER 1: Build the project
FROM base AS builder-dist

# Install dependencies only when needed
COPY package.json ./
# Install all the dependencies
RUN npm install

# Copy files and build
COPY . .
RUN npm run build

# LAYER 2: Install production dependencies
FROM base AS builder-deps

# Install dependencies only when needed
COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev --omit=optional --omit=peer

# LAYER 3: Production image
FROM base AS final

# Copy node modules and package.json from builder-deps
COPY --from=builder-deps /srv/api/node_modules ./node_modules
COPY --from=builder-deps /srv/api/package.json ./package.json
# Copy built files from builder-dist
COPY --from=builder-dist /srv/api/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]

