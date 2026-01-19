# Use official Nginx image
FROM nginx:alpine

# Copy all HTML pages
COPY *.html /usr/share/nginx/html/

# Copy CSS folders
COPY css/ /usr/share/nginx/html/css/
COPY components/ /usr/share/nginx/html/components/
COPY single-products/ /usr/share/nginx/html/single-products/
COPY layout/ /usr/share/nginx/html/layout/
COPY pages/ /usr/share/nginx/html/pages/

# Copy JS folders
COPY js/ /usr/share/nginx/html/js/
COPY js/single-product/ /usr/share/nginx/html/js/single-product/

# Copy image folders
COPY img/ /usr/share/nginx/html/img/
COPY products/ /usr/share/nginx/html/products/
COPY brands/ /usr/share/nginx/html/brands/
COPY categories/ /usr/share/nginx/html/categories/
COPY campaigns/ /usr/share/nginx/html/campaigns/
COPY avatars/ /usr/share/nginx/html/avatars/
COPY footer/ /usr/share/nginx/html/footer/
COPY slider/ /usr/share/nginx/html/slider/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
