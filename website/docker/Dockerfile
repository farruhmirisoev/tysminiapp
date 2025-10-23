# office_office:latest
FROM node:lts-alpine

# устанавливаем простой HTTP-сервер для статики
RUN npm install -g http-server

ADD dist /app/dist
# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /app

EXPOSE 8080
CMD [ "http-server", "dist" ]
