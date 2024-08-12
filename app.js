const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");

const app = express(); //basically we run the express() and give all power to app variable.
const server = http.createServer(app);

const io = socket(server); // basically it want server made up from http and it is based on express server.

const chess = new Chess();
let players = {};
let currentPlayer = 'w';

// ejs is html with superpower and the possibility to do math stuff and process where html des not have that's why we set template engine to ejs.
app.set("view engine", "ejs");    

// we have to tell where we get static file so we write the path of the folder through this way we define file in that folder.
// for the below path function we have to require path.
app.use(express.static(path.join(__dirname, "public")));


app.get("/" , (req, res) => {
    res.render("index", { title : "Chess Game" });
});


// here uniquesocket is unique data when the client enter the url
// For this to run we have to add socket in the client side(frontend) because the socket on the server side run when the client access the frontend part. it is neccesary bcz it connect server to frontend in realtime.
io.on("connection", function (uniquesocket) {
    console.log("connected");

    if(!players.white){
        // the first player that is join give him white.
        players.white = uniquesocket.id;
        // emit this on the frontend side
        uniquesocket.emit("playerRole", "w");
    }
    else if(!players.black){
        // the second player that is join give him black after white to first player.
        players.black = uniquesocket.id;
        // emit this on the frontend side
        uniquesocket.emit("playerRole", "b");
    }
    // others that are join are spectator.
    else{
        // we don't do the first part that is player.spectator bcz we don't wanna add another object in player just only two white and black.
        uniquesocket.emit("spectatorRole");
    }
    
    // if disonnect occur from frontend side than we detect and execute the process
    uniquesocket.on("disconnect", function(){
        if(uniquesocket.id === players.white){
            delete players.white;
        }
        else if(uniquesocket.id === players.black){
            delete players.black;
        }
    });
    
    // move is emitting from frontend side and we catch it in the backend side here.
    uniquesocket.on("move", (move) =>{
        try{
            // the below two line check whether the correct player is moving the pieces and the given color of that player which is assigned to it from starting.
            if(chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if(chess.turn() === "b" && uniquesocket.id !== players.black) return;
            
            // result store true/false if the correct move is being done than the chess.move will result true and if is executed
            // if below one fail due to engine failure than it redirect to catch error after failure in try.
            const result = chess.move(move); // this will move in backend memory, and to run in frontend we have to emit in boardState

            if(result){
                currentPlayer = chess.turn(); // this will return w or b which tell whom turn
                io.emit("move", move); //we return the move to the frontend and to every tab that are open to player1 , player2, spectator.

                // ex- The FEN piece placement field for this position is "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1" bascially this show the current state of the board.
                io.emit("boardState", chess.fen()); //we have also transfer the game state to frontend. 
            }
            else{
                // basically here we transfer the reason due to which error occur.
                console.log("Invalid move : ", move);
                uniquesocket.emit("invalidMove", move);
            }
        }
        catch(err){
            console.log(err);
            uniquesocket.emit("invalidMove", move);
        }
      });

  });

  
// HERE WE DON'T USE APP.LISTEN INSTEAD of it we use server.listen that is made up of using http form app.
server.listen(3000, function() {
    // the below operation will show in terminal side.
    console.log("Listening on port 3000");
});
