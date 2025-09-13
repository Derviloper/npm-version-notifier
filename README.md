# npm-version-notifier

A simple tool that monitors npm package version updates and sends notifications to a Discord webhook. It periodically checks specified npm packages, fetches release notes from GitHub if available, and posts an embed message to a Discord channel.

## Features

- Monitors multiple npm packages.
- Fetches release notes from GitHub.
- Sends notifications via Discord webhook.
- Configurable via environment variables.
- Docker-ready.

## Installation

Prerequisites:

- Node.js (>=22)
- npm
- Docker (optional)

### Clone the repo

```bash
git clone https://github.com/Derviloper/npm-version-notifier.git
cd npm-version-notifier
```

### Install dependencies

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```bash
SPECS=package1@latest package2@^1.0.0
CRON_TIME=0 */10 * * * *
DISCORD_WEBHOOK_ID=your_webhook_id
DISCORD_WEBHOOK_TOKEN=your_webhook_token
GITHUB_TOKEN=your_github_token (optional, for higher rate limits)
```

- **SPECS**: Space-separated list of npm package specs to monitor.
- **CRON_TIME**: Cron expression for checking updates.
- **DISCORD_WEBHOOK_ID** & **DISCORD_WEBHOOK_TOKEN**: Discord webhook credentials.
- **GITHUB_TOKEN**: (Optional) GitHub token for API calls.

## Usage

### Development

```bash
npm run dev
```

### Build and Run

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t npm-version-notifier .
docker run --env-file .env npm-version-notifier
```

## Scripts

- `npm run dev`: Run in watch mode.
- `npm run build`: Compile TypeScript.
- `npm start`: Run built app.
- `npm run types`: Check types.
- `npm run lint`: Lint code.
- `npm run lint:fix`: Fix lint issues.
- `npm run format`: Check code formatting.
- `npm run format:fix`: Fix code formatting.
