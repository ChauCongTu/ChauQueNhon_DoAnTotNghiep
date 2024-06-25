# laravel/Dockerfile
FROM php:8.2-fpm-alpine

WORKDIR /var/www/app

RUN apk update && apk add \
    libpng-dev \
    zip \
    unzip \
    autoconf \
    curl \
    libzip-dev \
    nodejs \
    npm \
    supervisor

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY . .

RUN composer install

RUN npm install -g laravel-echo-server

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

USER root
RUN chmod 777 -R /var/www/app
RUN chown -R www-data:www-data /var/www/app

EXPOSE 9000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
