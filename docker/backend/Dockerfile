FROM ubuntu

RUN apt update
RUN apt install wget software-properties-common build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev libbz2-dev netcat ffmpeg libsm6 libxext6 -y

RUN wget https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tgz
RUN tar -xf Python-3.8.2.tgz
RUN rm Python-3.8.2.tgz

RUN cd Python-3.8.2 && ./configure --enable-optimizations
RUN cd Python-3.8.2 && make -j 8
RUN cd Python-3.8.2 && make install

RUN rm -rf Python-3.8.2

RUN pip3 install -U pip setuptools

COPY trigger.sh trigger.sh
COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt
WORKDIR /server
