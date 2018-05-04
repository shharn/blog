## How to build dev image
> cd ./server
> docker build --tag puppyloper/blog-api-server:dev --target dev .

If you want it to be run on standalone,
> docker run -it --rm -p {host-port}:10000 -v $(pwd)/src/github.com/shharn/blog:/go/src/github.com/shharn/blog puppyloper/blog-api-server:dev

## How to build production image
> cd ./server
> docker build --build-arg app_env=production --target prod --tag puppyloper/blog-api-server:prod .

## How to start & stop service for development
> docker-compose --file docker-compose.dev.yml up --build
> docker-compose --file docker-compose.dev.yml down

## How to start service for production
> docker swarm init
> docker stack deploy -c docker-compose.prod.yml [service-name-you-want]