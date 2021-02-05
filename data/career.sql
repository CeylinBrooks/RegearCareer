<<<<<<< HEAD
=======

>>>>>>> e01b66eaeda2c15efa786df27735faedafde4258
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS meetups;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users CASCADE;

<<<<<<< HEAD
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  zip INTEGER,
  career VARCHAR(255)
);

=======
>>>>>>> e01b66eaeda2c15efa786df27735faedafde4258
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
  title VARCHAR(255),
  type VARCHAR(255),
  location VARCHAR(255),
  date DATE
);