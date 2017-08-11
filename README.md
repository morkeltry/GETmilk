# GETmilk: a FAC Shopping List :cake: :chocolate_bar: :cookie: 

## User stories

Too many times have tired faccers tried to wake themselves up with a strong cup of coffee, only to find that there's only instant left. Gross. 

With no time to run to Simply Fresh before the next workshop starts, wouldn't it be great to add coffee to an online FAC shopping list so that anyone can buy it on their next shop?

For convenience, wouldn't it also be great if the list can be viewed without having to log in? But obviously only tried and tested FACcers should be able to add items to the list once they've made an account.

Introducing GETmilk, the official FAC shopping app. Never go thirsty again.

## MVP & SGs

We wanted our core app to allow users to sign up if necessary, log in, view and add shopping list items, and log out. 

If we had 100% more time, we would have also attempted the following stretch goals:
* allow users to strike through items once they've been bought
* admin users to have permission to delete items

## Requirements

- [ ]  Login form with 2 fields - username and password
- [ ]  Client-side and server-side validation on login form, including error handling that provides feedback to users
- [ ]  Users only have to log in once (i.e. implement a cookie-based session on login)
- [ ]  Username is visible on each page of the site after logging in
- [ ]  Any user-submitted content should be labelled with the authors username
- [ ]  There should be protected routes and unprotected routes that depend on the user having a cookie or not (or what level of access they have).
- [ ]  Website content should be stored in a database
 

## Architecture
![Our project architecture](https://user-images.githubusercontent.com/24795752/29128194-089cf2fa-7d1b-11e7-9e88-7c8b45765e64.jpg)


## View our project (with thanks to Rebeca)

In order to run our site, you will need to set up a local database as follows.

In terminal type psql or pgcli if installed and type each of the below commands. Things in square brackets are for your desired values (without square brackets). Note that password is a string inside '' (NOT double ""):

```
CREATE DATABASE [db_name];
CREATE USER [user_name] WITH PASSWORD ['password'];
```
Now you can set the database url in your config.env as follows (setting the values in square brackets to the values you defined in the steps above):

`postgres://[user_name]:[password]@localhost:5432/[db_name]`

Next run the db_build.js file in terminal: 

`node src/database/db_build.js` 

This will create the schema and populate it with a small amount of data.
