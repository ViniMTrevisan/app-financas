FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copia apenas o JAR compilado
COPY target/Finance-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]