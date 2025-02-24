# Discord Management Bot

A Discord bot built with discord.js that helps manage server activities with features like AFK status tracking, roll call, and more.

## Features

### 1. AFK System
- `/afk [duration]` - Set your AFK status with a specified duration
- `/back` - Return from AFK status
- Tracks AFK duration and displays time spent away
- Customizable duration options (5-30 minutes)

### 2. Roll Call System
- `/rollcall` - Lists all users in the current voice channel
- Shows user status (muted/deafened)
- Includes timestamp of roll call
- Displays total user count

### 3. Basic Commands
- `/ping` - Basic connectivity test
- `/hello` - Greets the user

## Setup

1. **Prerequisites**
   - Node.js (Latest LTS version recommended)
   - npm (Node Package Manager)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [your-repo-url]

   # Install dependencies
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with:
   ```
   DISCORD_TOKEN=your_bot_token
   SERVER_ID=your_server_id
   ```

4. **Starting the Bot**
   ```bash
   npm start
   ```

## Development Guide

### Project Structure
