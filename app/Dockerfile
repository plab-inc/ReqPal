FROM node:latest as build

WORKDIR /usr/src/app

ARG VITE_API_ENDPOINT
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_URL

ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

COPY package.json ./

RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:latest as build-serve
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]