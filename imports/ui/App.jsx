import React, { useState } from 'react';
import {Board} from "./Board";
import {GameForm} from "./GameForm";
import {PlayerNameForm} from "./PlayerNameForm";
import {BattlePositionForm} from "./BattlePositionForm";
import { GamesCollection } from "../db/GamesCollection";
import { useTracker } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";


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
        if (game.playerStatus.includes('win'))
            return;

        Meteor.call('game.shoot', game._id, player, i);
    };

    const saveBattlePosition = (ships) => {
        Meteor.call('game.saveBattlePosition', game._id, player, ships);
    };

    const startGame = () => {
        Meteor.call('game.start', game._id, player);
    }

    const shipsLeft = [
        game ? game.tiles[0].filter(tile => tile.isShip && !tile.isBombed).length : '',
        game ? game.tiles[1].filter(tile => tile.isShip && !tile.isBombed).length : '',
    ] ;



    return (
        <div className="app">
            <div className="app-hdr">
                <h1 align="center">Battleships</h1>
            </div>
            { game ? (
                <>
                    <div className="game-summary">
                        <table>
                            <tbody>
                            <tr>
                                <th></th>
                                <th>Player name</th>
                                <th>Unhit ships</th>
                                <th>Player code to join</th>
                            </tr>
                            <tr>
                                <td>
                                    <div className="player-summary-player">Player 1: </div>
                                </td>
                                <td>
                                    <div className="player-summary-playerName">{game.playerName[0]}</div>
                                </td>
                                <td>
                                    <div className="player-summary-playerScore">{shipsLeft[0]}</div>
                                </td>
                                <td>
                                    <div className="player-summary-code">{game.gameId[0]}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="player-summary-player">Player 2: </div>
                                </td>
                                <td>
                                    <div className="player-summary-playerName">{game.playerName[1]}</div>
                                </td>
                                <td>
                                    <div className="player-summary-playerScore">{shipsLeft[1]}</div>
                                </td>
                                <td>
                                    <div className="player-summary-code">{game.gameId[1]}</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        { game.playerStatus[+!player]==='notPresent' && <h3>Please give Player 2 the code to join: {game.gameId[1]}</h3>}
                    </div>

                    <div className="game-main">
                    { ['ready', 'win', 'lost'].includes(game.playerStatus[+player]) && (
                        <Board
                            nextMove={game.isPlayer1Next !== player}
                            tiles={game.tiles[+!player].map(tile => ({isShip: tile.isShip && tile.isBombed, isBombed: tile.isBombed}))}
                            handleClick={game.isPlayer1Next !== player ? handleClick : () => void 0}
                            playerName={ game.playerName[+!player] }
                            boardTitle="Opponent's ships (your moves)"
                        />
                    )}
                    { game.playerStatus[+player] === 'joined' && <PlayerNameForm gameId={game._id} player={player} /> }
                    { ['name', 'position'].includes(game.playerStatus[+player]) && <BattlePositionForm
                        hasPosition={ game.playerStatus[+player] === 'position'}
                        savePosition={ saveBattlePosition }
                        startGame={startGame}
                    />}
                    <Board
                        nextMove={game.isPlayer1Next === player}
                        tiles={game.tiles[+player]}
                        handleClick={() => void 0}
                        playerName={ game.playerName[+player] }
                        boardTitle="Your ships (opponent's moves)"
                    />

                    </div>

                    { game.playerStatus.includes('win') && (
                    <div className="game-results-outer">
                        <div className="game-results-inner">
                            <h1>You {game.playerStatus[+player]} !!!</h1>
                        </div>
                    </div>
                    )}
                </>
                ) : (
                <GameForm setGameId={setGameId} />
            )}
        </div>
    );
};
