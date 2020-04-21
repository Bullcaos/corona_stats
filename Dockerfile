FROM debian

WORKDIR /var/www/corona_stats/

RUN apt update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt install -y nodejs

COPY *.json /var/www/corona_stats/
COPY *.js /var/www/corona_stats/
COPY views/ /var/www/corona_stats/views/

RUN npm install

EXPOSE 8081

ENTRYPOINT [ "node", "/var/www/corona_stats/covid.js", "proxy", "8081" ]