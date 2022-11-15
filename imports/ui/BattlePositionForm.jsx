import React from "react";

export const BattlePositionForm = ({ savePosition, startGame, hasPosition }) => {

    const newShip = (board, shipSize) => {
        const boardSize = board.length;
        var x, y, orientation, shipSizeX, shipSizeY;
        var isSpaceOccupied = true;
        while (isSpaceOccupied) {
            isSpaceOccupied = false;
            orientation = Math.random() < 0.5; // true - vertical, false - horizontal
            shipSizeX = orientation ? shipSize : 1;
            shipSizeY = orientation ? 1 : shipSize;
            x = Math.round(Math.random() * (boardSize - shipSizeX));
            y = Math.round(Math.random() * (boardSize - shipSizeY));

            // check if fields around are not occupied yet
            for (var i = Math.max(x - 1, 0); i <= Math.min(x + shipSizeX, boardSize - 1); i++)
                for (var j = Math.max(y - 1, 0); j <= Math.min(y + shipSizeY, boardSize - 1); j++)
                    isSpaceOccupied ||= board[i][j];
        }

        // place ship
        for (i = x; i < x + shipSizeX; i++)
            for (j = y; j < y + shipSizeY; j++)
                board[i][j] = true;
        return board;
    }

    const generatePosition = () => {
        const boardSize = 10;
        var ships = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
        var i, j;
        for (i = 4; i; i--)
            for (j = 1; j <= 5 - i; j++)
                ships = newShip(ships, i);

        savePosition(ships.flat());
    };

    return(
        <div className="game-form">
            <div>
                <button onClick={generatePosition}>Generate random battleships position</button>
            </div>

            { hasPosition && <div><button onClick={startGame}>Start game</button></div>}
        </div>
    );
};