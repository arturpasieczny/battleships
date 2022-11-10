import React from "react";

const Tile = ({tile, handleClick, id}) => {
    return (
        <button
            className = { tile.isShip ? 'ship' : 'water' }
            onClick = { () => handleClick(id) }
        >
            { tile.isBombed ? 'X' : '' }
        </button>
    );
};

export const Board = ({ owned, tiles, handleClick }) => {
    return (
        <div className="board">
        {[...Array(10)].map((x, i) => (
        <div className="board-row">
            {[...Array(10)].map((y, j) => (
              <Tile key={i*10+j} id={i*10+j} tile={tiles[i*10+j]} handleClick={handleClick}/>
            ))}
        </div>
        ))}
        </div>
    );
};