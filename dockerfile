#use debian:bookworm as base image (because i love debian)
FROM debian:bookworm

#set the main directory (files, etc) 
WORKDIR /app

#copy all files in this folder except the ones in .dockerignore
COPY . .

#install necessary packages and clean up
RUN apt update && apt install -y --no-install-recommends \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

#install the node modules (only production)
RUN npm ci --only=production

#link the node modules
RUN npm link

#set the entrypoint (endless bash script)
ENTRYPOINT ["bash", "ENTRYPOINT.sh"]