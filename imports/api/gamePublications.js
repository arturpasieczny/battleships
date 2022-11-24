import { Meteor } from "meteor/meteor";
import { GamesCollection } from "../db/GamesCollection";

Meteor.publish('games', function publishGames() {
    return GamesCollection.find({});
});