## How to build docker image of blog-front
* For development 
> docker build --tag {tag-name-you-want} --file client/Dockerfile.dev --force-rm ./client
* For production
> docker build --tag {tag-name-you-want} --file client/Dockerfile.prod --force-rm ./client

## How to start application for development (with hot-reload)
docker-compose --file docker-compose.dev.yaml up --build

## How to start application using kubernetes on local machine
* Prerequisite
    * kubectl
    * minikube

* Command
> ./kube-start.sh
