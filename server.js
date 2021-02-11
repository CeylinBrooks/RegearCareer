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
app.get('/aboutus', aboutHandler);
// app.get('/favorites', favoriteHandler)
app.get('*', errorHandler)

// SQL Routes and Calls
app.post('/results', resultHandler)

// Function Handlers
function aboutHandler(req, res) {
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

  let SCHOOL_DB_CHECK = `SELECT school_name, school_url, address, city, state_name, zip, distance, program_name, program_length FROM schools WHERE keyword = $1;`;
  let JOB_DB_CHECK = `SELECT job_title, company, date, url, location FROM jobs WHERE keyword = $1;`;
  let MEETUP_DB_CHECK = `SELECT meet_up_name, address, phone, website, hours FROM meetups WHERE keyword = $1;`;

  let value = [keyword];


  client.query(SCHOOL_DB_CHECK, value)
    .then( school => {
      client.query(JOB_DB_CHECK, value)
        .then( job => {
          client.query(MEETUP_DB_CHECK, value)
            .then (meetUp => {
              if( school.rowCount > 0 || job.rowCount > 0 || meetUp.rowCount > 0) {
                res.render('pages/results', {school: school.rows, job: job.rows, meetUp: meetUp.rows })
              } else {

                superagent.get(cosUrl)
                  .set('Authorization', `Bearer ${key}`)

                  .then(data => data.body.SchoolPrograms.map(item => new School(item)))
                  .then(school => {

                    superagent.get(cosUrl2)
                      .set('Authorization', `Bearer ${key}`)
                      .then(data2 => data2.body.Jobs.map(item2 => new Career(item2)))
                      .then(job => {
                    // END OF SECOND SUPER AGENT CALL

                  //Third API CALL
                        superagent.get(meetupUrl)
                          .set('Authorization', `Bearer ${key}`)
                          .then(data3 => data3.body.OneStopCenterList.map(item3 => new Meetup(item3)))
                          .then(meetUp => {
                          //FINAL RENDER OF ALL 3 CALLS
                            if (school.length != 0 || job.length != 0 || meetUp.length != 0) {

                              // SAVE TO DATABASE 
                              insertData(school, job, meetUp, keyword)
                              //RENDER API TO PAGE
                              res.render('pages/results', { school: school, job: job, meetUp: meetUp })
                            } else {
                              res.render('pages/no-results')
                              }
                          })
                      })
                  })
                    .catch(err => {
                      console.log(err);
                      res.render('pages/no-results')
                  })
                  
              // END OF ELSE STATEMENT FOR CLIENT.QUERY
              } 
            })
        })
    })
}

function insertData(school, job, meetUp, keyword) {
  let SCHOOL_INSERT = `INSERT INTO schools (school_name, school_url, address, city, state_name, zip, distance, program_name, program_length, keyword)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`;
  let JOB_INSERT = `INSERT INTO jobs (job_title, company, date, url, location, keyword) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;
  let MEETUP_INSERT = `INSERT INTO meetups (meet_up_name, address, phone, website, hours, keyword) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  
  school.forEach( item => {
    let schoolVal = [item.school_name, item.school_url, item.address, item.city, item.state_name, item.zip, item.distance, item.program_name, item.program_length, keyword];
    client.query(SCHOOL_INSERT, schoolVal)
      .then( result => console.log("IM SAVING SCHOOL TO THE DATABASE ", result))
      .catch(err => console.log(err))
  })

  job.forEach( item => {
    let jobVal = [item.job_title, item.company, item.date, item.url, item.location, keyword];
    client.query(JOB_INSERT, jobVal)
      .then( result => console.log("IM SAVING JOB TO DB", result))
      .catch(err => console.log(err))
  })

  meetUp.forEach( item => {
    let meetUpVal = [item.meet_up_name, item.address, item.phone, item.website, item.hours, keyword];
    client.query(MEETUP_INSERT, meetUpVal)
      .then( result => console.log("IM SAVING MEETUP TO DATABASE", result))
      .catch(err => console.log(err))
  })

}


// Data Constructors

function School(obj) {
  this.school_name = obj.SchoolName
  this.school_url = obj.SchoolUrl
  this.address = obj.Address
  this.city = obj.City
  this.state_name = obj.StateName
  this.zip = obj.Zip
  this.phone = obj.Phone
  this.distance = obj.Distance
  this.program_name = obj.ProgramName
  this.program_length = obj.ProgramLength[0].Value
}

function Career(obj) {
  this.job_title = obj.JobTitle
  this.company = obj.Company
  this.date = obj.AccquisitionDate
  this.url = obj.URL
  this.location = obj.Location
}

function Meetup(obj) {
  this.meet_up_name = obj.Name
  this.address = `${obj.Address1} ${obj.Address2}, ${obj.City} ${obj.StateName}`
  this.phone = obj.Phone
  this.website = obj.WebSiteUrl
  this.hours = obj.OpenHour
}



// Instancing of the App
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
