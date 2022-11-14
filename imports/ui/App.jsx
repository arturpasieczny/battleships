import React, { useState } from 'react';
import {Board} from "./Board";
import {GameForm} from "./GameForm";
import { GamesCollection } from "../db/GamesCollection";
import { useTracker } from 'meteor/react-meteor-data';


export const App = () => {

    const [gameId, setGameId] = useState('');

    const game = useTracker (() => {
         let game = gameId ? GamesCollection.findOne({gameId: gameId}) : '';
         return game ? game : '';
     });
    const player = game ? game.gameId[0] !== gameId : '';

    const handleClick = (i) => {
        if (game.tiles[+!player][i].isBombed)
            return;
        var changedTiles = game.tiles.slice();
        changedTiles[+!player][i].isBombed = true;
        GamesCollection.update({_id: game._id}, {$set:{isPlayer1Next: !game.isPlayer1Next}});
        GamesCollection.update({_id: game._id}, {$set:{tiles: changedTiles}})
    };
    console.log('player:', player);
    console.log('next:', game.isPlayer1Next);
    return (
        <div className="app">
            <div className="app-hdr">
                <h1 align="center">Battleships</h1>
            </div>
            { game ? (
                    <div className="game-main">
                        <Board
                            nextMove={game.isPlayer1Next !== player}
                            tiles={game.tiles[+!player]}
                            handleClick={game.isPlayer1Next !== player ? handleClick : () => void 0}
                            playerName={ game.playerName[+!player] }
                            boardTitle="Opponent's ships (your moves)"
                        />

                        <Board
                            nextMove={game.isPlayer1Next === player}
                            tiles={game.tiles[+player]}
                            handleClick={() => void 0}
                            playerName={ game.playerName[+player] }
                            boardTitle="Your ships (opponent's moves)"
                        />

                    </div>
            ) : (
                <GameForm setGameId={setGameId} />
            )}
        </div>
    );
};
