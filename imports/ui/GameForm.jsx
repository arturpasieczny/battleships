import { Meteor } from "meteor/meteor";
import React, {useState} from "react";
import { Random } from 'meteor/random';
import { GamesCollection } from "../db/GamesCollection";

export const GameForm = ({setGameId} ) => {
    const [player1Name, setPlayer1Name] = useState('');
    const [gameSecret, setGameSecret] = useState('');
    const [linkError, setLinkError]  = useState('');

    const handleNewGame = e =>{
        e.preventDefault();

        if (!player1Name) return;

        var player1GameId = Random.id();
        setGameId(player1GameId);

        Meteor.call('game.create', player1Name, player1GameId);
    };

    const handleJoinGame = e => {
        e.preventDefault();

        const game = GamesCollection.findOne({gameId: gameSecret});
        if (!game){
            setLinkError('Invalid id, check with invitor');
            return;
        }
        const player = game.gameId[0] !== gameSecret;
        const newGameSecret = Random.id();

        Meteor.call('game.join', gameSecret, player, newGameSecret);
        setGameId(newGameSecret);
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