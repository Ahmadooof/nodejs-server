FROM node:alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ["../package.json", "../package-lock.json*", "./"]

RUN npm install --production

COPY . .

ENV REACT_APP_OPENAI_API_KEY=default-value

COPY entrypoint.sh /app

RUN chmod +x /app/entrypoint.sh

EXPOSE 4000

CMD ["/app/entrypoint.sh"]