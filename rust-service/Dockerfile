# Stage 1: Build
FROM rust:1.85 AS builder

WORKDIR /app

# Copy Cargo files first for caching dependencies
COPY Cargo.toml Cargo.lock* ./

# Copy the actual source code
COPY src ./src

# Build the Rust application
RUN cargo build --release

RUN mv target/release/rust-service /app/rust-service

CMD ["/app/rust-service"]
