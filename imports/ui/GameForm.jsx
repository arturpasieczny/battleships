import React, {useState} from "react";
import { Random } from 'meteor/random';
import {GamesCollection} from "../db/GamesCollection";

export const GameForm = ({setGameId} ) => {
    const [player1Name, setPlayer1Name] = useState('');
    const [gameSecret, setGameSecret] = useState('');
    const [linkError, setLinkError]  = useState('');

    const handleNewGame = e =>{
        e.preventDefault();

        if (!player1Name) return;
        const emptyBoard = Array(100).fill({
            isShip: false,
            isBombed: false,
        })

        // var gameId = (Random.id());
        // setGameId(gameId);
        var player1GameId = Random.id();
        var player2GameId = Random.id();
        setGameId(player1GameId);

        const isPlayer1Next = Math.random() < 0.5;

        GamesCollection.insert({
            tiles: [emptyBoard, emptyBoard],
            playerName: [player1Name.trim(), ''],
            gameId: [player1GameId, player2GameId],
            isPlayer1Next,
            createdAt: new Date(),
        });
    };

    const handleJoinGame = e => {
        e.preventDefault();

        var game = GamesCollection.findOne({gameId: gameSecret});
        if (!game){
            setLinkError('Invalid id, check with invitor');
            return;
        }
        setGameId(gameSecret);
    };

    return (
        <div>
            <form onSubmit={handleNewGame} className="game-form">
                <h2>Create new game</h2>
                <div>
                    <label htmlFor="player1Name">Player name</label>

                    <input
                        type="text"
                        placeholder="your name"
                        name="player1Name"
                        required
                        onChange={e => setPlayer1Name(e.target.value)}
                    />
                </div>

                <div>
                    <button type="submit">Create game</button>
                </div>
            </form>

            <form onSubmit={handleJoinGame} className="game-form">
                <h2>or join existing one</h2>
                <div>
                    <label htmlFor="gameSecret">Game identifier</label>
                    <input
                        type="text"
                        placeholder="id received in invitation"
                        name="gameSecret"
                        required
                        onChange={e => setGameSecret(e.target.value)}
                    />
                </div>
                { linkError && <span className="error"> {linkError} </span> }
                <div>
                    <button type="submit">Join game</button>
                </div>
            </form>
        </div>
    );
};