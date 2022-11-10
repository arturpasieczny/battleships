import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import {Board} from "./Board";


export const App = () => {

    const [tiles, setTiles] = useState(Array(100).fill({
        isShip: false,
        isBombed: false,
    }));


    const handleClick = (i) => {
        var changedTiles = tiles.slice();
        // changedTiles[i].isBombed = !tiles[i].isBombed;
        changedTiles[i] = {isBombed: !tiles[i].isBombed, isShip: tiles[i].isShip}
        setTiles(changedTiles)
    };


    return (
        <div className="app">
            <Board owned='true' tiles={tiles} handleClick={handleClick}/>
        </div>
    );
};
