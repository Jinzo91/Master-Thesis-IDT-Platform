# Dockerfile for IDT Web API

# Base image 
FROM node:12-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy all file into container
COPY . .

# Applicaiton build instructions
RUN npm install
RUN npm install gulp -g
RUN npm run build
RUN gulp copy-static
RUN gulp copy-hbs

# Expose application port
EXPOSE 3000

# Executable entrypoint to start the container
CMD npm run start