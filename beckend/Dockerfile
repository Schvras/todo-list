FROM node:16

# Create app directory
RUN mkdir -p /usr/src/todo-list/node_modules && chown -R node:node /usr/src/todo-list/

WORKDIR /usr/src/todo-list/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "./src/server.js" ]