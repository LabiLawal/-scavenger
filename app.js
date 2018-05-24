const express = require("express");
var app = express();

const path = require('path');
const request = require("request");
const cheerio = require("cheerio");

const Xray = require("x-ray");
var xray = new Xray();
const fs = require('fs');


const pg = require('pg');

const mysql = require("mysql");

// const dbconnect = process.env.DATABASE_URL || 'postgres://localhost:3030';
// const db = new pg.Client(db);
// const db = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password:"lawalchilli",
//         database:"flydealz"
// });
// db.connect((err)=>{
//     if(err){
//         throw err;
//     }
//     console.log("MySql connected..");
// });

var controller = require("./controllers/control");
controller(app, request, xray);

app.use(express.static("public"));

app.set("view engine", "ejs");

var port = (process.env.PORT || 3030);
app.listen(port);
console.log("Server is up at port" + port);