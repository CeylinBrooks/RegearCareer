'use strict';

// Dependencies for the Server itself
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');


// Creation of the Server
const app = express();
const PORT = process.env.PORT || 3000;

// Setup of EJS Templating
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// Deleting items in the Database
app.use(methodOverride('_method'));

// DATABASE Set Up
const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
client.on('error', err => {
  console.log(err);
});


// Routes
app.get('/', homeHandler)
app.get('results', resultHandler)
// app.get('/favorites', favoriteHandler)

// SQL Routes and Calls
app.post('/form', formHandler)

// Function Handlers

function homeHandler(req, res) {
  res.render('pages/index')
}

function formHandler(req, res) {

let SQL = 'INSERT INTO users (name, email, zip, career) VALUES ($1, $2, $3, $4);'

let values = [req.body.name, req.body.email, req.body.zip, req.body.career];

client.query(SQL, values)
.then (result => {
  res.redirect(``)
})
.catch ( err => {
 console.log(err); 
})

}

function resultHandler(req, res) {

}

// Data Constructors

// Instancing of the App
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
