CREATE TABLE "data"."USERS" (
  "User ID" INT NOT NULL,
  "User Name" VARCHAR(50) NOT NULL,
  "Email" VARCHAR(50) NOT NULL,
  "First Name" VARCHAR(30) NULL,
  "Last Name" VARCHAR(30) NULL,
  PRIMARY KEY ("User ID"));

CREATE TABLE "data"."POSTS" (
  "POST ID" INT NOT NULL,
  "User ID" INT NOT NULL,
  "Likes" INT NULL DEFAULT 0,
  "Topic ID" INT NULL,
  "Text" VARCHAR(300) NULL,
  PRIMARY KEY ("POST ID"));

  CREATE TABLE "data"."LIKES" (
  "Like ID" INT NOT NULL,
  "Post ID" INT NOT NULL,
  "User ID" INT NOT NULL,
  PRIMARY KEY ("Like ID"));

CREATE TABLE "data"."COMMENTS" (
  "Comment ID" INT NOT NULL,
  "Post ID" INT NOT NULL,
  "User Id" INT NOT NULL,
  "CommentText" VARCHAR(300) NOT NULL,
  PRIMARY KEY ("Comment ID"));

CREATE TABLE "data"."TOPICS" (
  "Topic ID" INT NOT NULL,
  "TopicText" VARCHAR(30) NOT NULL,
  PRIMARY KEY ("Topic ID"));

CREATE TABLE "data"."PASSWORDS" (
  "User ID" INT NOT NULL,
  "EncryptedPassword" VARCHAR(100) NOT NULL,
  PRIMARY KEY ("User ID"));
