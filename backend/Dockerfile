# # Use a slim, official OpenJDK base image
# FROM eclipse-temurin:17-jdk-jammy

# # Set a working directory inside the container
# WORKDIR /app

# # Copy the built JAR file from the target directory into the container
# # The name might vary based on your artifactId and version in pom.xml
# COPY target/applydash-0.0.1-SNAPSHOT.jar app.jar

# # Expose the port the app runs on
# EXPOSE 8080

# # The command to run the application
# ENTRYPOINT ["java", "-jar", "app.jar"]




# --- Stage 1: Build the application ---
# Use a Maven image to build the project. It includes JDK and Maven.
FROM maven:3.8-openjdk-17 AS builder

# Set the working directory
WORKDIR /app

# Copy the pom.xml first to leverage Docker's layer caching.
# Dependencies are only re-downloaded if pom.xml changes.
COPY pom.xml .

# Copy the rest of your source code
COPY src ./src

# Build the project and create the .jar file. Skip tests for a faster build.
RUN mvn clean package -DskipTests

# --- Stage 2: Create the final, small runtime image ---
# Use the slim JRE image you originally had for a smaller footprint
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy ONLY the built .jar file from the 'builder' stage
COPY --from=builder /app/target/applydash-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]