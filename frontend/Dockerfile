FROM node
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install react-router-dom
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]