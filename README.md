# StandYak
Location Aware Social Network (think YikYak) - Node.js &amp; MariaDB

## Install

This needs a MariaDB or MySQL DB instance to run! Connection details need to go in ` /bin/db.js `
Setup files for creating the necessary tables and inserting dummy information into them are included in the ` SQL ` dir.

``` npm install ```

Then

``` npm start ```

Recomended that the Forever module to run the server with.

## Details

Coursework project for Databases module. Using MariaDB we had to create a location aware social networking platform. Instead of going for PHP, I opted for a Node JS front and backend using the popular MySQL node module. 

The frontend is Angular, and there are 3 main elements: 

- The main page shows all recently posted messages but also has buttons to fetch messages that have been like, and messages that have had locations tagged in them (a small Google Maps iframe is available to view each message's location).  
- The profile page allows users to post messages with or without a location, or delete/modify them. 
- The login/signup system allows users to become a member.

The backend has a REST style API for communication with the frontend. There are various routes involved for posting, modify and deleting messages, creating and signing in to accounts, as well as for fetching messages from the DB. Due to the database being SQL, the queries to fetch post information that spans across multiple tables are quite complex.



