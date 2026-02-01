# Build Stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy generic files
COPY go.mod ./
# COPY go.sum ./ # Uncomment when dependencies are real
RUN go mod download || true # Mock download

COPY . .

# Build the binary
RUN go build -o core-orchestrator ./cmd/server

# Run Stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/core-orchestrator .
COPY --from=builder /app/.env.example .env

# Expose API Port
EXPOSE 8080

# Run
CMD ["./core-orchestrator"]
