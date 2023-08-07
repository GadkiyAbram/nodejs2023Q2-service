FROM node:16
WORKDIR /gadkiyabram/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --force
RUN npx prisma generate
RUN apt update
COPY . .
RUN npm run build
CMD [ "npm", "run", "start:dev" ]