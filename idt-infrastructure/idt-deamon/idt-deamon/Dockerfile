FROM node:12-alpine
WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm run build

## Add the wait script to the image
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
# RUN chmod +x /wait

EXPOSE 3000
# CMD /wait && npm run start
CMD npm run start