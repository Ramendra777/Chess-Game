// this line will work when our side load and js will run and then this line also run in multiple browser which has the url
// this line send the req to io.on in backend during multiple connection.
const socket = io();

// acquiring chess engine here
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    // console.log(board); // --> it will show an array of chess board
    
    // creating dynamic square with pieces if they have
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            
            // console.log(square, squareindex); // this will print all row and col

            // for square pieces we create a div and add two classname to it.
            const squareElement = document.createElement("div");
            squareElement.classList.add("square", (rowindex+squareindex) % 2 === 0 ? "Light" : "dark");
            
            // we are assigned value to each square dataset row and column wise.
            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            if(square){
                // if square has some value than we create a class piece and add two classname to it.
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black"
                );
                
                // below one we pass the square to getPieceUnicode so that we get the pieces
                pieceElement.innerText = getPieceUnicode(square);
                // below one square.color tells about the pieces color not the box color 
                pieceElement.draggable = playerRole === square.color; //true/false

                pieceElement.addEventListener("dragstart", (e) => {
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;
                        // sourceSquare tells about from which position the piecelement is being dragged.
                        sourceSquare = {row : rowindex, col : squareindex};  
                        // an event is being passed and we just have to set this step is compulsary for smooth drag.
                        e.dataTransfer.setData("text/plain", "");
                    } 
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });
                
                //here we append the piece child in the square when the dragend.
                squareElement.appendChild(pieceElement);

            };
            
            // basically when the square box is getting being dragged than the square box is not going to dragged , this is being done by dragover eventListener.
            squareElement.addEventListener("dragover", function(e) {
                e.preventDefault();
                
            });

            squareElement.addEventListener("drop", function(e) {
                // basically it will stop the basic nature of event e and we can write on our own.
                e.preventDefault();
                if(draggedPiece){
                const targetValue = {
                    row: parseInt(squareElement.dataset.row), //basically thing in dataset is a string.
                    col: parseInt(squareElement.dataset.col),
                };
                
                // basically this function place piece to target1 to target2.
                handleMove(sourceSquare, targetValue);
            }
            });
            boardElement.appendChild(squareElement);
        });
    });
    

    // basically here we flip the chess board in accordance to player Role
    if(playerRole === "b"){
    boardElement.classList.add("flipped");
    }
    else{
    boardElement.classList.remove("flipped");
    }

};

const handleMove = (source, target) => {
    // String.fromCharCode(97+0) == 'a'
    const move = {
        from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
        to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion: 'q',
    }
    
    // sending move event to backend side
    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        P: "♟",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔",
    };

    return unicodePieces[piece.type] || "";
};

renderBoard();
