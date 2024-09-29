FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies, including nodemon globally
RUN npm install -g nodemon && npm install

# Copy the rest of your application code
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Command to run your server
CMD ["npm", "run", "dev"]
