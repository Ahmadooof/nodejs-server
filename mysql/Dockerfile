# Use the official MySQL image as the base image
FROM mysql:latest

# Set environment variables
ENV MYSQL_USER YWhtYWQ=
ENV MYSQL_PASSWORD RmFtaWx5MS4yLjM=
ENV MYSQL_ROOT_PASSWORD RmFtaWx5MS4yLjM=

# Expose the MySQL port
EXPOSE 3306

#the initialization scripts in the `/docker-entrypoint-initdb.d/` directory are executed by the root user when the container starts up.
COPY init.sql /docker-entrypoint-initdb.d/
