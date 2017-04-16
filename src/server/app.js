import Server from './server';
import Express from 'express';

const express = new Express();
express.use('/static',Express.static('static'));

const server = new Server(express, server);
server.start();