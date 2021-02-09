DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS meetups;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE schools (
  school_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(255),
  description VARCHAR(255),
  tuition INTEGER
);

CREATE TABLE jobs (
  job_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  salary INTEGER,
  seniority_level VARCHAR(255)
);

CREATE TABLE meetups (
  meet_up_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255),
  website VARCHAR(255),
  hours VARCHAR(255)
);
