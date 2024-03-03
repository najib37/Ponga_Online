FROM  node:20-bookworm

WORKDIR /home/client

RUN apt update

COPY ./Frontend /home/client

COPY --chmod=755 ./healthcheck.sh ./healthcheck.sh
COPY --chmod=755 ./setup.sh ./setup.sh

RUN npm install 

CMD bash /home/client/setup.sh
