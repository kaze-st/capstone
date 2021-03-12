FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the collaborative coding backend API."

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install
COPY . .
RUN ls
RUN ls src
RUN npm  run build

EXPOSE 8080

CMD ["npm", "start"]
