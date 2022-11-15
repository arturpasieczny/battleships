import React, {useState} from "react";
import {GamesCollection} from "../db/GamesCollection";

export const PlayerNameForm = ({gameId, player}) => {
    const [playerName, setPlayerName] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        const game = GamesCollection.findOne({_id: gameId});

        var newPlayerName = game.playerName.slice();
        newPlayerName[+player] = playerName;

        var newPlayerStatus = game.playerStatus.slice();
        newPlayerStatus[+player] = 'name';

        GamesCollection.update({_id: gameId}, {$set:{playerName: newPlayerName, playerStatus: newPlayerStatus}});
    };

    return(
            <form onSubmit={onSubmit} className="game-form">
                <h2>Joining the game</h2>
                <div>
                    <label htmlFor="playerName">Player name</label>

                    <input
                        type="text"
                        placeholder="your name"
                        name="playerName"
                        required
                        onChange={e => setPlayerName(e.target.value)}
                    />
                </div>

                <div>
                    <button type="submit">Join the game</button>
                </div>
            </form>
    );
};