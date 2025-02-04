FROM node:20-alpine3.19

WORKDIR /lab-man

COPY . .

RUN npm i -g pnpm
RUN pnpm install

# Default values
ARG NODE_ENV=production
ARG WEB_PORT=3000
ARG ORIGIN=http://localhost:$WEB_PORT

# Parsed args
ENV NODE_ENV=$NODE_ENV
ENV PORT=$WEB_PORT
ENV ORIGIN=$ORIGIN

EXPOSE $WEB_PORT

RUN if [ "$NODE_ENV" = "production" ]; then \
    pnpm build; \
    fi

CMD if [ "$NODE_ENV" = "production" ]; then \
    node --env-file=.env build; \
    else \
    pnpm dev --host --port $WEB_PORT; \
    fi
