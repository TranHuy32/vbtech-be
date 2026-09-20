# Stage 1: Build the application
FROM node:20.15.0-alpine AS build

WORKDIR /app
COPY ./package*.json ./
RUN ls /app -al
RUN npm i
COPY ./ ./
RUN npm run build user-api

# Stage 2: Create the final image
FROM node:20.15.0-alpine

WORKDIR /app
COPY --from=build /app/dist/apps/user-api ./dist
COPY --from=build /app/node_modules ./node_modules
COPY ./package*.json ./

CMD [ "node" , "dist/main" ]

