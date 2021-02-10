DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS meetups;
DROP TABLE IF EXISTS jobs;


CREATE TABLE schools (
  school_id SERIAL PRIMARY KEY,
  school_name VARCHAR(255),
  school_url VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(255),
  state_name VARCHAR(255),
  zip VARCHAR(255),
  distance VARCHAR(255),
  program_name VARCHAR(255),
  program_length VARCHAR(255),
  keyword VARCHAR(255)
);

CREATE TABLE jobs (
  job_id SERIAL PRIMARY KEY,
  job_title VARCHAR(255),
  company VARCHAR(255),
  date VARCHAR(255),
  url VARCHAR(255),
  location VARCHAR(255),
  keyword VARCHAR(255)
);

CREATE TABLE meetups (
  meet_up_id SERIAL PRIMARY KEY,
  meet_up_name VARCHAR(255),
  address VARCHAR(255),
  phone VARCHAR(255),
  website VARCHAR(255),
  hours VARCHAR(255),
  keyword VARCHAR(255)
);
