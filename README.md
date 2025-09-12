# HNRobert Homepage

A personal homepage and portfolio website built with Next.js, featuring a modern React-based interface.

> Visit [My Actual Home Page](https://hnrobert.space) to see the effect

## Project Structure

```text
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── data/               # Static data and configurations
│   ├── services/           # API services
│   ├── styles/             # CSS styles
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── nginx/                  # Nginx configuration (legacy)
├── Dockerfile             # Docker container definition
└── docker-compose.yml    # Docker Compose configuration
```

## Features

- 🎨 Modern, responsive design
- 🌙 Dark/Light theme toggle
- 📱 Mobile-first approach
- 🚀 Fast loading with Next.js optimizations
- 🐳 Docker containerized deployment
- 📊 GitHub API integration for project showcase
- 💼 Portfolio sections (projects, tech stack, hobbies)

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/HNRobert/hnrobert-homepage.git
   cd hnrobert-homepage
   ```

2. Install dependencies:

   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:9970](http://localhost:9970) in your browser.

## Docker Deployment

### Using Docker Compose (Recommended)

1. Clone this repository:

   ```bash
   git clone https://github.com/HNRobert/hnrobert-homepage.git
   cd hnrobert-homepage
   ```

2. Start the application:

   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Web interface: `http://localhost:9970`

### Using Docker Directly

1. Build the image:

   ```bash
   docker build -t hnrobert-homepage .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 hnrobert-homepage
   ```

### Using Pre-built Image

```bash
docker pull ghcr.io/hnrobert/hnrobert-homepage:latest
docker run -p 3000:3000 ghcr.io/hnrobert/hnrobert-homepage:latest
```

## Environment Variables

Create a `.env` file in the root directory for customization:

```env
# Application Settings
PORT=3000
HOSTNAME=0.0.0.0

# Next.js Settings
NEXT_TELEMETRY_DISABLED=1

# Production/Development Mode
NODE_ENV=production
```

## Troubleshooting

- Check container logs:

  ```bash
  docker-compose logs
  ```

- Restart services:

  ```bash
  docker-compose restart
  ```

- Stop services:

  ```bash
  docker-compose down
  ```

## Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Deployment**: Docker, GitHub Container Registry
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm
