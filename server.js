'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// DATABASE Set up
const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
client.on('error', err => {
  console.log(err);
});

app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));