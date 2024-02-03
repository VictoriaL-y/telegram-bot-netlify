# Telegram Bot (Netlify serverless functions version) project documentation

## Preface

This project is a Telegram Bot project, created with the purpose to allow all the users to convert ingredients quantity from US measurements to EU.

The bot was deployed on Netlify and can be accessed here: **https://t.me/ingredients_converter_bot**

## Details

* Use /help command to get information about requirements for a converson request and an example.

* Users can also improve the database: add new ingredients, as well as edit and delete existing ones.

## Install depencencies & Run the project locally

Clone the repository with `git clone RepoUrl` to your local machine, then open a terminal in the folder or open in the IDE of choice (e.g. VSCode)

### Node package manager

Using the terminal, first install dependencies with

`npm install`

### Telegram API

To install Node.js module to interact with the official Telegram Bot API

`npm install node-telegram-bot-api`

### Dotenv

To install the Dotenv module that loads environment variables

`npm install dotenv`

It's also necessary to set on Netlify the following environment variables: TELEGRAM_TOKEN, MONGODB_USER and MONGODB_PASSWORD

### Axios

To install a promise based HTTP client for the browser and node.js

`npm i axios express`

### Set WebHook

Create a get request on postman https://www.postman.com/

`curl -F "url=https://<netlify URL>.netlify.app/.netlify/functions/update" https://api.telegram.org/bot{TELEGRAM_TOKEN}/setWebhook`

where `<netlify URL>` is the Netlify's site name

### MongoDB

To create a database

Get a free cloud based database from https://www.mongodb.com/, use the database's password and login to connect the database to the projet

### mongoose

To install mongoos to create a schema for the database

`npm install mongoose`

## Available Scripts

In the project directory, you can run:

`npm start`

Runs the app in the development mode.\
Open [http://localhost:4040](http://localhost:4040) to view it in your browser.

You may also see any lint errors in the console.