# HNRobert Homepage

A web application for managing and accessing files through WebDAV, featuring a modern React-based interface.

> Visit [Here](https://hnrobert.space) to see the effect

## Project Structure

- `webdav-client/` - React-based frontend application
  - `src/services/` - WebDAV client implementation
  - `src/components/` - React components
  - `src/hooks/` - Custom React hooks
  - `src/app/` - Root page routing

## Features

- File browsing and navigation
- File download with progress tracking
- Responsive design
- Chunked file downloads
- Retry mechanism for failed downloads
- Sorting options for files and directories

## Development Setup

1. Install dependencies:

```bash
cd webdav-client
npm install
```

2. Start a WebDAV Host at port 9976 (in this case)

3. Start development server:

```bash
npm run start:dev
```

The application will be available at `http://localhost:9970`

## Build

For development build:

```bash
npm run build:dev
```

For production build:

```bash
npm run build:prod
```

## Technical Stack

- React 18
- TypeScript
- WebDAV client library
- Tailwind CSS for styling
- Craco for build configuration
