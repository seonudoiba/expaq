FROM maven:3.8.7-openjdk-18-slim AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk
COPY --from=build /target/expaq-0.0.1-SNAPSHOT.jar expaq.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","expaq.jar"]