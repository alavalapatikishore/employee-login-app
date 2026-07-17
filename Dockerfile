FROM nginx:alpine

# Copy all site files into NGINX html directory
COPY . /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
