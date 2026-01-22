# Use Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy and install dependencies
COPY package.json ./
RUN npm install --production

# Copy all files
COPY . .

# Expose the port Railway assigns dynamically
EXPOSE 3000

# Start the Express app
CMD ["node", "agent.js"]
