@echo off
REM Docker Deployment Helper Script for Windows
REM Usage: deploy-docker.bat [build|start|stop|restart|logs|clean]

setlocal enabledelayedexpansion

set CONTAINER_NAME=invoicing-frontend
set IMAGE_NAME=invoicing-frontend:latest

if "%1"=="" goto usage

if "%1"=="build" goto build
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="clean" goto clean
if "%1"=="status" goto status
if "%1"=="deploy" goto deploy
goto usage

:build
echo [BUILD] Building Docker image...
docker build -t %IMAGE_NAME% -f DockerFile . || goto error
echo [SUCCESS] Docker image built successfully
goto end

:start
echo [START] Starting containers...
if not exist .env.local (
    echo [INFO] Creating .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=https://invoicesystembackend-1.onrender.com/api
        echo NEXT_PUBLIC_BACKEND_URL=https://invoicesystembackend-1.onrender.com/api
    ) > .env.local
    echo [SUCCESS] .env.local created
)
docker-compose up -d || goto error
echo [SUCCESS] Containers started
echo [INFO] Application available at: http://localhost:3000
goto end

:stop
echo [STOP] Stopping containers...
docker-compose down || goto error
echo [SUCCESS] Containers stopped
goto end

:restart
echo [RESTART] Restarting containers...
call :stop
call :start
goto end

:logs
echo [LOGS] Showing logs (Ctrl+C to exit)...
docker-compose logs -f
goto end

:clean
echo [CLEAN] Cleaning Docker resources...
docker-compose down -v
docker rmi %IMAGE_NAME% 2>nul
echo [SUCCESS] Cleanup complete
goto end

:status
echo [STATUS] Container Status:
docker-compose ps
echo.
echo [INFO] Recent Logs:
docker-compose logs --tail=20
goto end

:deploy
echo [DEPLOY] Starting full deployment...
call :build
if errorlevel 1 goto error
call :start
if errorlevel 1 goto error
call :status
goto end

:usage
echo Usage: %0 {build^|start^|stop^|restart^|logs^|clean^|status^|deploy}
echo.
echo Commands:
echo   build   - Build Docker image
echo   start   - Start containers
echo   stop    - Stop containers
echo   restart - Restart containers
echo   logs    - View container logs
echo   clean   - Remove containers and images
echo   status  - Show container status and logs
echo   deploy  - Full deployment (build + start)
exit /b 1

:error
echo [ERROR] Command failed
exit /b 1

:end
echo [DONE] Operation completed
exit /b 0
