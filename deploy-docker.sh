#!/bin/bash

# Docker Deployment Helper Script
# Usage: ./deploy-docker.sh [build|start|stop|restart|logs|clean]

set -e

CONTAINER_NAME="invoicing-frontend"
IMAGE_NAME="invoicing-frontend:latest"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

echo_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    echo_success "Docker is installed"
}

check_env() {
    if [ ! -f .env.local ]; then
        echo_info "Creating .env.local file..."
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://invoicesystembackend-1.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://invoicesystembackend-1.onrender.com/api
EOF
        echo_success ".env.local created"
    else
        echo_success ".env.local exists"
    fi
}

build_image() {
    echo_info "Building Docker image..."
    docker build -t $IMAGE_NAME -f DockerFile . || {
        echo_error "Build failed"
        exit 1
    }
    echo_success "Docker image built successfully"
}

start_container() {
    echo_info "Starting containers..."
    docker-compose up -d || {
        echo_error "Failed to start containers"
        exit 1
    }
    echo_success "Containers started"
    echo_info "Application available at: http://localhost:3000"
}

stop_container() {
    echo_info "Stopping containers..."
    docker-compose down || {
        echo_error "Failed to stop containers"
        exit 1
    }
    echo_success "Containers stopped"
}

restart_container() {
    echo_info "Restarting containers..."
    stop_container
    start_container
}

show_logs() {
    echo_info "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

clean_docker() {
    echo_info "Cleaning Docker resources..."
    docker-compose down -v
    docker rmi $IMAGE_NAME 2>/dev/null || true
    echo_success "Cleanup complete"
}

show_status() {
    echo_info "Container Status:"
    docker-compose ps
    echo ""
    echo_info "Recent Logs:"
    docker-compose logs --tail=20
}

case "$1" in
    build)
        check_docker
        check_env
        build_image
        ;;
    start)
        check_docker
        check_env
        start_container
        ;;
    stop)
        check_docker
        stop_container
        ;;
    restart)
        check_docker
        restart_container
        ;;
    logs)
        check_docker
        show_logs
        ;;
    clean)
        check_docker
        clean_docker
        ;;
    status)
        check_docker
        show_status
        ;;
    deploy)
        check_docker
        check_env
        build_image
        start_container
        show_status
        ;;
    *)
        echo "Usage: $0 {build|start|stop|restart|logs|clean|status|deploy}"
        echo ""
        echo "Commands:"
        echo "  build   - Build Docker image"
        echo "  start   - Start containers"
        echo "  stop    - Stop containers"
        echo "  restart - Restart containers"
        echo "  logs    - View container logs"
        echo "  clean   - Remove containers and images"
        echo "  status  - Show container status and logs"
        echo "  deploy  - Full deployment (build + start)"
        exit 1
        ;;
esac
