import React, {useState} from "react";
import { Random } from 'meteor/random';
import { Session } from "meteor/session";
import {GamesCollection} from "../db/GamesCollection";

export const GameForm = () => {
    const [gameId, setGameId] = useState('');
    const [player1Name, setPlayer1Name] = useState('');

    const handleSubmit = e =>{
        e.preventDefault();

        if (!player1Name) return;
        const emptyBoard = Array(100).fill({
            isShip: false,
            isBombed: false,
        })

        setGameId(Random.id());
        Session.set("gameID", gameId);
        const isPlayer1Next = Math.random() < 0.5;

        GamesCollection.insert({
            player1Tiles: emptyBoard,
            player2Tiles: emptyBoard,
            player1Name: player1Name.trim(),
            player2Name: '',
            isPlayer1Next,
            gameId
        });
    };

    return (
        <form onSubmit={handleSubmit} className="game-form">
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
    );
};