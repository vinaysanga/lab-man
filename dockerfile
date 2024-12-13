FROM node:20-alpine3.19

WORKDIR /app

COPY . .

RUN npm i -g pnpm
RUN pnpm install

ARG NODE_ENV=production
ARG PORT=3000
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV ORIGIN=http://localhost:$PORT

EXPOSE $PORT

RUN if [ "$NODE_ENV" = "production" ]; then \
    pnpm build; \
    fi

CMD if [ "$NODE_ENV" = "production" ]; then \
    node --env-file=.env build; \
    else \
    pnpm dev --host --port $PORT; \
    fi
