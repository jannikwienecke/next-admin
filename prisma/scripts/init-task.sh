cat ./prisma/task.sql | docker exec -i 12e71fda940c  psql -U postgres -d db