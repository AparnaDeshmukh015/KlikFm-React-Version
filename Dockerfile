WORKDIR /usr/src/app
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
RUN apk add --no-cache python3 make g++ bash

COPY package*.json ./
RUN npm install 
COPY . .
ARG ENV_FILE=.env.dev
RUN cp $ENV_FILE .env
RUN npm run build


# ============================
# 2. Production Stage (Nginx)
# ============================
FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
