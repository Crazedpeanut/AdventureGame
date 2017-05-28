const Express = require('express');
const GameObjectRoutes = require('./routes/game-object-routes');

const express = new Express();

express.use('/static',Express.static('static'));
express.use('/gameObject', GameObjectRoutes);

express.listen('8080');

