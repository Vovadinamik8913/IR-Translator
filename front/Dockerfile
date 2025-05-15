FROM node:18-alpine as build
WORKDIR /app
COPY front/package.json /app/package.json
RUN npm install --only=prod
COPY front /app
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]