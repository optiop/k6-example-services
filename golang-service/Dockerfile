# Stage 1: Build the Go application
FROM golang:1.23-alpine AS builder

# Install dependencies required for building
RUN apk add --no-cache git gcc musl-dev

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum files first to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the application with static linking
RUN CGO_ENABLED=1 GOOS=linux go build -a -ldflags '-linkmode external -extldflags "-static"' -o main .

# Stage 2: Create the minimal runtime image
FROM alpine:3.18

# Install runtime dependencies
RUN apk add --no-cache postgresql-client ca-certificates libc6-compat tzdata

# Set the working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Set environment variables (customize as needed)
ENV DB_HOST=postgres \
    DB_PORT=5432 \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    DB_NAME=postgres

# Expose the port your application runs on
EXPOSE 8080

# Run the application
CMD ["./main"]
