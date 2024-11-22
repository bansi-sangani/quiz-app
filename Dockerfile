# Use the official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire application code into the container
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose port 5000 (or whatever port your app runs on)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
