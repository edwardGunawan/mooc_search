FROM node:latest

# set working directory
WORKDIR /usr/src/app

# add `/usr/node_modules/.bin` to $PATH
ENV PATH /usr/src/node_modules/.bin:$PATH

# install and cache up app dependencies
ADD package.json /usr/src/package.json
RUN npm install

# Copy source code
COPY . .

# start app
CMD ["npm", "start"]
