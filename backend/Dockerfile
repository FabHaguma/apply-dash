# Use a slim, official OpenJDK base image
FROM eclipse-temurin:17-jdk-jammy

# Set a working directory inside the container
WORKDIR /app

# Copy the built JAR file from the target directory into the container
# The name might vary based on your artifactId and version in pom.xml
COPY target/applydash-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]