# Stage 1: Install dependencies and build the app
FROM node:19 AS builder

# DEFINE ARGS
ARG NEXT_PUBLIC_API_KEY

# USE ARGUMENTS IN ENVIRONMENT VARIABLES
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy all files and build the app
COPY . .
RUN npm run build

# Stage 2: Create a production image
FROM node:19 AS runner
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --production --legacy-peer-deps

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "start"]