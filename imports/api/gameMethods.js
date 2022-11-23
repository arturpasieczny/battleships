import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { GamesCollection } from "../db/GamesCollection";
import {Random} from "meteor/random";

Meteor.methods({
    'game.create' (player1Name, player1GameId) {
        check(player1Name, String);
        check(player1GameId, String);

        const player2GameId = Random.id();
        const isPlayer1Next = Math.random() < 0.5;
        const emptyBoard = Array(100).fill({
            isShip: false,
            isBombed: false,
        });

        GamesCollection.insert({
            tiles: [emptyBoard, emptyBoard],
            playerName: [player1Name.trim(), ''],
            playerStatus: ['name', 'notPresent'],
            gameId: [player1GameId, player2GameId],
            isPlayer1Next,
            createdAt: new Date()
        });
    },

    'game.join' (gameId, player, newGameSecret) {
        // re-generate player's ID to prevent cheating
        check(gameId, String);
        check(player, Boolean);
        check(newGameSecret, String);

        const game = GamesCollection.findOne({gameId: gameId})
        if(!game)
            throw new Meteor.Error('Not authorized.');


        const newGameId = game.gameId.slice();
        newGameId[+player] = newGameSecret;
        const  newPlayerStatus = game.playerStatus.slice();
        if (newPlayerStatus[+player] === 'notPresent')
            newPlayerStatus[+player] = 'joined';

        GamesCollection.update({_id: game._id}, {$set: {gameId: newGameId, playerStatus: newPlayerStatus}});
    },

    'game.setPlayerName' (gameId, player, playerName) {
        check(gameId, String);
        check(player, Boolean);
        check(playerName, String);

        const game = GamesCollection.findOne({_id: gameId});
        if(!game)
            throw new Meteor.Error('Not authorized.');

        var newPlayerName = game.playerName.slice();
        newPlayerName[+player] = playerName;

        var newPlayerStatus = game.playerStatus.slice();
        newPlayerStatus[+player] = 'name';

        GamesCollection.update({_id: gameId}, {$set:{playerName: newPlayerName, playerStatus: newPlayerStatus}});
    },

    'game.saveBattlePosition' (gameId, player, ships) {
        check(gameId,String);
        check(player, Boolean);
        check(ships, Array);

        const game = GamesCollection.findOne({_id: gameId});
        if(!game)
            throw new Meteor.Error('Not authorized.');

        var changedTiles = game.tiles.slice();
        changedTiles[+player] = ships.map(ship => ({
            isBombed: false,
            isShip: ship,
        }));
        GamesCollection.update({_id: game._id}, {$set:{tiles: changedTiles}});

        var changedPlayerStatus = game.playerStatus.slice();
        changedPlayerStatus[+player] = 'position';
        GamesCollection.update({_id: game._id}, {$set:{playerStatus: changedPlayerStatus}});
    },

    'game.start' (gameId, player) {
        check(gameId,String);
        check(player, Boolean);

        const game = GamesCollection.findOne({_id: gameId});
        if(!game)
            throw new Meteor.Error('Not authorized.');

        const changedPlayerStatus = game.playerStatus.slice();
        changedPlayerStatus[+player] = 'ready';
        GamesCollection.update({_id: game._id}, {$set:{playerStatus: changedPlayerStatus}});
    },

    'game.shoot' (gameId, player, tile) {
        check(gameId,String);
        check(player, Boolean);
        check(tile, Number);

        const game = GamesCollection.findOne({_id: gameId});
        if(!game)
            throw new Meteor.Error('Not authorized.');

        const changedTiles = game.tiles.slice();
        changedTiles[+!player][tile].isBombed = true;
        GamesCollection.update({_id: game._id}, {$set:{isPlayer1Next: !game.isPlayer1Next}});
        GamesCollection.update({_id: game._id}, {$set:{tiles: changedTiles}})

        const shipsLeft = [
            game.tiles[0].filter(tile => tile.isShip && !tile.isBombed).length,
            game.tiles[1].filter(tile => tile.isShip && !tile.isBombed).length,
        ];

        //handle end of game
        if (game.playerStatus[0] === 'ready' && game.playerStatus[1] === 'ready') {
            let newStatus = [];
            if(!shipsLeft[0])
                newStatus = ['lost', 'win'];
            if(!shipsLeft[1])
                newStatus = ['win', 'lost'];
            if (newStatus.includes('win'))
                GamesCollection.update({_id: game._id}, {$set:{playerStatus: newStatus}});
        }
    }
})