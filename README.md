# Intruduction

## System Requirements
- Docker: Latest version
- Docker Compose: Latest version

### Step 1: Install Docker and Docker Compose

#### Ubuntu/Debian

Run command:
```terminal
# Install Docker
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po 'tag_name": "\K[0-9.]+')" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```
#### Windows & macOS
Download and install Docker Desktop from the Docker website: [Docker Website](https://docs.docker.com/desktop/install/windows-install/)

### Step 2: Clone the Project

- Run command: `git clone https://github.com/ChauCongTu/ChauQueNhon_DoAnTotNghiep.git`
- Run command: `code ChauQueNhon_DoAnTotNghiep`
- Run command: `git checkout dockerize`

### Step 3: Prepare Environment Files

Copy the environment file for the backend and generate the application key follow:

```
cp backend/.env.example backend/.env
```

```
docker-compose exec backend php artisan key:generate
```

### Step 4: Run Docker Compose

In the root directory of the project, run the following command to build and start the Docker services: `docker-compose up --build`

## Access Services
- Frontend: http://localhost:3000/
- Backend: http://localhost:9000/request-docs
- Predict Model: http://localhost:5000/api/v1/predict

## Check and Debug

- View container logs: `docker-compose logs`
- Access a container for inspection or debugging: `docker-compose exec <service-name> sh`

Replace <service-name> with backend, frontend, or predict_model depending on the service you want to access.