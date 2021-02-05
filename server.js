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
// app.get('results', resultHandler)
// app.get ('/about', aboutHandler);
// app.get('/favorites', favoriteHandler)
app.get('*', errorHandler)

// SQL Routes and Calls
app.post('/results', resultHandler)

// Function Handlers

function errorHandler(req, res) {
  res.render('pages/error');
}

function homeHandler(req, res) {
  res.render('pages/index')
}

function resultHandler(req, res) {
  let keyword = req.body.career;
  let zip = req.body.zipcode;
  let key = process.env.COS_APIKEY
  let user = process.env.COS_USERID
  let cosUrl = `https://api.careeronestop.org/v1/training/${user}/${keyword}/${zip}/150/0/0/0/0/0/0/0/0/10`;


console.log(cosUrl)
superagent.get(cosUrl)
.set(
  'Authorization', `Bearer ${key}`
)

.then(data => {
  data.body.SchoolPrograms.forEach(item => {
    let program = new School(item)
  })
  
.then (result => {
  res.render('pages/results', {data: result})
})

})
.catch(err => {
  console.log(err); 
})
}


// function resultHandler(req, res) {

// }

// Data Constructors

function School(obj) {
this.schoolName = obj.SchoolName
this.schoolUrl = obj.SchoolUrl
this.address = obj.Address
this.city = obj.City
this.stateName = obj.StateName
this.zip = obj.Zip
this.phone = obj.Phone
this.distance = obj.Distance
this.programName = obj.ProgramName
this.programLength = obj.ProgramLength
}

// Instancing of the App
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
