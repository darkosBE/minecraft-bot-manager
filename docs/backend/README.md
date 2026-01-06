# AFK Console Client - Backend Setup

## Installation

1. Copy these files to your VPS
2. Run `npm install`
3. Run `node start.js` or `npm start`

## Configuration

The backend runs on port **1043** by default.

## Frontend Connection

1. Open the frontend app
2. Go to **Settings** page
3. Enter your VPS URL: `http://YOUR_VPS_IP:1043`
4. Click "Test" to verify connection
5. Click "Save & Reconnect"

## Features

- Multi-bot management
- Real-time chat monitoring via Socket.IO
- Anti-AFK system with configurable actions
- Auto-reconnect on disconnect
- Multi join/world change messages
- JSON persistence for settings

## CORS

The server.js includes CORS headers to allow connections from any frontend origin.
