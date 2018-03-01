FROM node:carbon
MAINTAINER Edward Huang


# set working directory
WORKDIR /usr/src/app

# install and cache up app dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . /usr/src/app

# start app
CMD ["npm", "start"]
