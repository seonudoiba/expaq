# Use Ubuntu image to set up the environment.
FROM ubuntu:latest AS build

# Install OpenJDK 17 and Maven.
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk maven

# Copy your source code into the Docker image
COPY . /app
WORKDIR /app

# Use Maven to build your application. Skip tests to speed up the build if not necessary.
RUN mvn clean package -DskipTests

# Use OpenJDK 17 slim image for a smaller production image
FROM openjdk:17-jdk-slim

# Expose the port that your Spring Boot application uses.
EXPOSE 8080

# Copy the built jar file from the build stage to the root of the new container.
COPY --from=build /app/target/*.jar app.jar

# Run your application
ENTRYPOINT ["java", "-jar", "app.jar"]
