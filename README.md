# Chess Game Project

## Overview
This project is a real-time online chess game built using Node.js, Express, Socket.io, and Chess.js. It allows players to play chess with each other over the internet.

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for handling HTTP requests and responses.
- **Socket.io**: Library for real-time web applications, used for handling bidirectional communication between the server and clients.
- **Chess.js**: Library for chess game logic, handling game rules and validations.
- **Path**: Built-in Node.js module for working with file and directory paths.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd chess-game
2. **Install dependencies:**
   ```bash
   npm install
3. **Run the server:**
   ```bash
   npx nodemon dirname

## Screenshot

![Screenshot 2024-08-06 221636](https://github.com/user-attachments/assets/8365c41e-f19b-49dc-b024-e9a0ad3d6e1c)

## Usage

1. Open the game in your browser:
- Navigate to http://localhost:3000 in your web browser.

2. Playing the Game:

- Start a new game by connecting to a server.
- Make moves by clicking on pieces and selecting destinations.
- Chat with other players in real-time.

## Features

- Real-Time Gameplay: Players can join as either the white or black player, or as spectators who watch the game.
- Move Validation: Ensures that moves follow the official chess rules.
- Board State: Keeps track of the current state of the board and shares it with everyone connected.
- Spectator Mode: Users who join after the first two players can watch the game.
