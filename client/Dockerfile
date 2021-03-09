FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the collaborative code editor"

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
