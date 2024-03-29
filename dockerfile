#use debian:bookworm as base image (because i love debian)
FROM debian:bookworm

#set the main directory (files, etc) 
WORKDIR /app

#copy all files in this folder except the ones in .dockerignore
COPY . .

#install necessary packages
RUN apt update -y && apt upgrade -y && apt install -y nodejs npm

#set the entrypoint (endless bash script)
ENTRYPOINT ["bash", "ENTRYPOINT.sh"]