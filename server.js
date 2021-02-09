'use strict';

// Dependencies for the Server itself
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');


// Creation of the Server
const app = express();
const PORT = process.env.PORT || 3000;

// Setup of EJS Templating
app.set('view engine', 'ejs');

app.use(cors());
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
// app.get('/results', resultHandler)
app.get ('/aboutus', aboutHandler);
// app.get('/favorites', favoriteHandler)
app.get('*', errorHandler)

// SQL Routes and Calls
app.post('/results', resultHandler)

// Function Handlers
function aboutHandler( req, res ) {
  res.render('pages/about-us');
}

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
  let cosUrl = `https://api.careeronestop.org/v1/training/${user}/${keyword}/${zip}/150/0/0/0/0/0/0/0/0/3`;
  let cosUrl2 = `https://api.careeronestop.org/v1/jobsearch/${user}/${keyword}/${zip}/150/0/0/0/3/14?source=NLx&showFilters=false`
  let meetupUrl = `https://api.careeronestop.org/v1/ajcfinder/${user}/${zip}/25/0/0/0/0/0/0/0/3`;


superagent.get(cosUrl)
  .set('Authorization', `Bearer ${key}`)

  .then(data => data.body.SchoolPrograms.map(item =>  new School(item)))
  .then (school => {
    // Second SUPERAGENT CALL
    superagent.get(cosUrl2)
      .set('Authorization', `Bearer ${key}`)
      .then(data2 =>  data2.body.Jobs.map( item2 => new Career(item2)))
      .then(job => {
    // END OF SECOND SUPER AGENT CALL
        
        //Third API CALL
        superagent.get(meetupUrl)
          .set('Authorization', `Bearer ${key}`)
          .then(data3 => data3.body.OneStopCenterList.map( item3 => new Meetup(item3)))
          .then(meetUp => {
            //FINAL RENDER OF ALL 3 CALLS
            res.render('pages/results', {school: school, job: job, meetUp: meetUp})
          })
      
      })
  })
  .catch(err => {
    console.log(err); 
  })
}

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

function Career(obj) {
  this.jobTitle = obj.JobTitle
  this.company = obj.Company
  this.date = obj.AccquisitionDate
  this.url = obj.URL
  this.location = obj.Location
}

function Meetup(obj) {
  this.meetUpName = obj.Name
  this.address = `${obj.Address1} ${obj.Address2}, ${obj.City} ${obj.StateName}`
  this.phone = obj.Phone
  this.website = obj.WebSiteUrl
  this.hours = obj.OpenHour
}



// Instancing of the App
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
