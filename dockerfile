# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Generate the Prisma client
RUN npx prisma generate

RUN npm run build

# Expose the default Next.js development port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]