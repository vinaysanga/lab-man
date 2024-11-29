FROM node:20-alpine3.19

WORKDIR /app

COPY . .

RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build

ENV NODE_ENV=production
ENV ORIGIN=http://localhost:3000

EXPOSE 3000

CMD ["sh", "-c", "node --env-file=.env build"]