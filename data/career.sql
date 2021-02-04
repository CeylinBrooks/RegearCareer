DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS meetups;
DROP TABLE IF EXISTS jobs;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255)
  zip INTEGER
  career VARCHAR(255)
);

CREATE TABLE schools (
  school_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(255),
  description VARCHAR(255),
  
  tuition INTEGER,
  user_id INTEGER REFERENCES users (user_id) 
);

CREATE TABLE jobs (
  job_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  salary INTEGER,
  seniority_level VARCHAR(255),
  user_id INTEGER REFERENCES users (user_id) 
);

CREATE TABLE meet_ups (
  meet_up_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  type VARCHAR(255),
  location VARCHAR(255),
  date DATE,
  user_id INTEGER REFERENCES users (user_id)
);