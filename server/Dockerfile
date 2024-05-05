#FROM eclipse-temurin:17-jdk-alpine
#VOLUME /tmp
#COPY target/expaq-0.0.1-SNAPSHOT.jar expaq.jar
#EXPOSE 8080
#ENTRYPOINT ["java","-jar","/expaq.jar"]

FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/expaq-0.0.1-SNAPSHOT.jar expaq.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","expaq.jar"]