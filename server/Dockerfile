FROM  node:20-bookworm

WORKDIR /home/Backend

RUN apt update
RUN apt install postgresql-client -y

COPY ./Backend /home/Backend

COPY --chmod=755 ./healthcheck.sh ./healthcheck.sh
COPY --chmod=755 ./setup.sh ./setup.sh

RUN npm install 

CMD bash /home/Backend/setup.sh
