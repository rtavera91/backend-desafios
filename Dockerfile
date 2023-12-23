FROM node:lts-alpine
ENV NODE_ENV=production
# ESPECIFICAR ABAJO TODAS LAS VARIABLES DE ENTORNO QUE SE NECESITEN, EJEMPLO: MONGO_URI, JWT_SECRET, ETC.
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
