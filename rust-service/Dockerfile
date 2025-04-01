# Stage 1: Build
FROM rust:1.85 AS builder

WORKDIR /app

# Copy the Cargo files for dependency caching
COPY Cargo.toml Cargo.lock* ./

# This is a trick to build dependencies first
RUN mkdir src && \
    echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs && \
    cargo build --release && \
    rm -f target/release/deps/app*

# Now copy the actual source code
COPY src ./src

# Build the application
RUN cargo build --release

# Stage 2: Runtime
FROM alpine:latest

# Install dependencies for Rust binaries
RUN apk add --no-cache libgcc

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/target/release/rust-service ./rust-service

EXPOSE 8081

# Set the entry point
CMD ["./rust-service"]
