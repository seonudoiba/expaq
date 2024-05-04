FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/expaq-0.0.1-SNAPSHOT.jar expaq.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/expaq.jar"]
