# HNRobert Homepage

A web application for managing and accessing files through WebDAV, featuring a modern React-based interface.

> Visit [My Actual Home Page](https://hnrobert.space) to see the effect

## Project Structure

- wip

## Features

- wip

## Development Setup

- wip

## Docker Compose Deployment

### Prerequisites

- Docker and Docker Compose installed on your system
- SSL certificates (optional, self-signed certificates will be created if not provided)

### Setup Instructions

1. Clone this repository:

 ```bash
git clone https://github.com/HNRobert/hnrobert-homepage.git
cd hnrobert-homepage
```

2. Start the services:

```bash
docker-compose up -d
```

3. Access the application:
   - Web interface: `http://localhost:9970` or `https://localhost:9977` (if SSL configured)

### Troubleshooting

- If the services fail to start, check the logs:

```bash
docker-compose logs
```

- If you need to restart the services:

```bash
docker-compose restart
```

- To stop the services:

```bash
docker-compose down
```

## Technical Stack

- React 18
- TypeScript
- Tailwind CSS for styling
- Craco for build configuration
- Docker for containerization
- Nginx as reverse proxy
