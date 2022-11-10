import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Session } from "meteor/session";
import {Board} from "./Board";
import {GameForm} from "./GameForm";
import { GamesCollection } from "../db/GamesCollection";


export const App = () => {

    const gameId = Session.get("gameId");
    console.log(Session.get("gameId"))
    const [tiles, setTiles] = useState(Array(100).fill({
        isShip: false,
        isBombed: false,
    }));

    const [player1Name, player2Name] = ['Zenek', 'Adam']
    const handleClick = (i) => {
        var changedTiles = tiles.slice();
        // changedTiles[i].isBombed = !tiles[i].isBombed;
        changedTiles[i] = {isBombed: !tiles[i].isBombed, isShip: tiles[i].isShip}
        setTiles(changedTiles)
    };


    return (
        <div className="app">
            { gameId ? (
            <table>
                <tr>
                    <td className='board-hdr'>
                        <h3>{ player1Name }</h3>
                        Your ships
                    </td>
                    <td className='board-hdr'>
                        <h3>{ player2Name }</h3>
                        Opponent's ships
                    </td>
                </tr>
                <tr>
                    <td>
                        <Board owned='true' tiles={tiles} handleClick={handleClick}/>
                    </td>
                    <td>
                        <Board owned='false' tiles={tiles} handleClick={handleClick}/>
                    </td>
                </tr>
            </table>
            ) : (
                <GameForm />
            )}
        </div>
    );
};
