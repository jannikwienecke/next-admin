# ~ docker container ls  | grep 'postgres' | awk '{print $1}'

CONTAINER_NAME=$(docker container ls  | grep 'postgres' | awk '{print $1}')

 cat ./prisma/task.sql | docker exec -i $CONTAINER_NAME  psql -U postgres -d db