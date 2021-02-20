FROM node:12-alpine AS builder

ENV CONFIGURATION production

COPY . ./idt-web
WORKDIR /idt-web
RUN npm i
RUN npm run build:${CONFIGURATION}

FROM nginx:1.15.8-alpine
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /idt-web/dist/idt-web/ /usr/share/nginx/html

EXPOSE 80