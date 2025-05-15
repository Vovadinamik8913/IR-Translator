FROM gradle:8.5-jdk21-alpine AS build
WORKDIR /app
RUN apk add --no-cache llvm clang
COPY translator .
RUN gradle build -x test

FROM openjdk:21-slim
WORKDIR /app
RUN mkdir -p /app/work && \
    mkdir -p /app/data && \
    apt-get update && \
    apt-get install -y wget software-properties-common gnupg && \
    wget https://apt.llvm.org/llvm.sh && chmod +x llvm.sh && \
    ./llvm.sh 19 && \
    apt-get install -y llvm-19 clang-19 && \
    apt-get install -y \
        ghc \
        rustc \
        ldc \
        crystal && \
    rm -rf /var/lib/apt/lists/* && \
    rm llvm.sh && \
    ln -s /usr/bin/clang-19 /usr/bin/clang && \
    ln -s /usr/bin/opt-19 /usr/bin/opt && \
    ln -s /usr/bin/ldc2 /usr/bin/ldc && \
    ln -s /usr/bin/javac-21 /usr/bin/javac && \
    ln -s /usr/bin/javap-21 /usr/bin/javap
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]