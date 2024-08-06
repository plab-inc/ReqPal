FROM node:latest as build

WORKDIR /usr/src/app

ARG API_ENDPOINT
ARG SUPABASE_ANON_KEY
ARG SUPABASE_PROJECT_ID

ENV VITE_API_ENDPOINT=${API_ENDPOINT}
ENV VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
ENV VITE_SUPABASE_URL=https://${SUPABASE_PROJECT_ID}.supabase.co

COPY package.json ./

#installing node_modules
RUN yarn install
#move app files into image
COPY . ./
#typecheck and build project
RUN yarn type-check
RUN yarn build:no-tsc

FROM nginx:latest as build-serve
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]