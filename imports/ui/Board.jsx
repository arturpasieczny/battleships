import React from "react";

const Tile = ({tile, handleClick, id}) => {
    return (
        <button
            className = { tile.isShip ? 'ship' : 'water' }
            onClick = { () => handleClick(id) }
        >
            { tile.isBombed ? 'X' : '\u00A0' }
        </button>
    );
};

export const Board = ({ nextMove, tiles, handleClick, playerName, boardTitle }) => {
    return (
        <div className= {nextMove ? "board-area-active" : "board-area-inactive"}>
            <div className="board-hdr">
                <h3>{ playerName }</h3>
                <p>{ boardTitle }</p>
            </div>
            <div className="board">
            {[...Array(10)].map((x, i) => (
            <div className="board-row" key={ i }>
                {[...Array(10)].map((y, j) => (
                  <Tile
                      key={i*10+j}
                      id={i*10+j}
                      tile={tiles[i*10+j]}
                      handleClick={handleClick}
                  />
                ))}
            </div>
            ))}
            </div>
        </div>
    );
};