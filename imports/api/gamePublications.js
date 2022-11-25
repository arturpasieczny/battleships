import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { GamesCollection } from "../db/GamesCollection";

Meteor.publish('games', function publishGames(gameId) {
    check(gameId, String)

    if (!gameId)
        return null;
    return GamesCollection.find({gameId: gameId});
});