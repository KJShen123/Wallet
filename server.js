const express = require("express");
const path = require("path");
const app = express();

const connectToDatabase = require("./js/dbConnection.js");

app.get("/css/styles1.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/styles1.css"));
})

app.get("/css/styles2.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/styles2.css"));
})

app.get("/js/scripts.js", (req, res) => {
    res.type('.js');
    res.sendFile(path.join(__dirname + "/scripts.js"));
})

//FYP page _______________________________________________________________________________________________

app.get("/css/loginCss.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/loginCss.css"));
})

app.get("/css/Wallet.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/Wallet.css"));
})

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/login.html"));
})

app.get("/linkWallet.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/linkWallet.html"));
})

app.get("/viewCV.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/viewCV.html"));
})

app.get("/viewConfirmation.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/viewConfirmation.html"));
})

app.get("/updateCV.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/updateCV.html"));
})

app.get("/updateConfirmation.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/updateConfirmation.html"));
})

app.get("/updateSuccessful.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/updateSuccessful.html"));
})

connectToDatabase();

const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);

app.get("/js/contract.js", (req, res) => {
    res.type('.js');
    res.sendFile(path.join(__dirname + "/js/contract.js"));
})