const userTableSql = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(100),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`

const surveysTableSql = `CREATE TABLE IF NOT EXISTS surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isPublished BOOLEAN DEFAULT FALSE,
    isStar BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    isDeleted BOOLEAN DEFAULT FALSE,
    userId INT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );`

const quesComponent = `CREATE TABLE IF NOT EXISTS ques_components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT
);`

// const questionsTableSql = `CREATE TABLE IF NOT EXISTS questions (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   survey_id INT NOT NULL,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   component_id INT NOT NULL,
//   required BOOLEAN DEFAULT false,
//   order INT NOT NULL
// );
// `

// const optionsTableSql = `CREATE TABLE IF NOT EXISTS options (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   question_id INT NOT NULL,
//   text VARCHAR(255) NOT NULL,
// );`

const dbTable = [userTableSql, surveysTableSql, quesComponent]

module.exports = dbTable