import React, {useState} from "react";

export const PlayerNameForm = ({gameId, player}) => {
    const [playerName, setPlayerName] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        Meteor.call('game.setPlayerName', gameId, player, playerName)
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