const express = require("express");
const path = require("path");
const app = express();

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})

app.get("/adminHome.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/adminHome.html"));
})

app.get("/addProduct.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/addProduct.html"));
})



app.get("/retailer.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/retailer.html"));
})

app.get("/transporter.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/transporter.html"));
})

app.get("/orderDetails.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/orderDetails.html"));
})

app.get("/adminSetDeliver.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/adminSetDeliver.html"));
})

app.get("/adminViewDelivery.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/adminViewDelivery.html"));
})

app.get("/adminViewHistory.html", (req, res) => {
    res.sendFile(path.join(__dirname + "/adminViewHistory.html"));
})

app.get("/css/styles1.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/styles1.css"));
})




app.get("/css/styles2.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/styles2.css"));
})

app.get("/scripts.js", (req, res) => {
    res.type('.js');
    res.sendFile(path.join(__dirname + "/scripts.js"));
})

//FYP page _______________________________________________________________________________________________

app.get("/css/loginCss.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/loginCss.css"));
})

app.get("/css/Saino.css", (req, res) => {
    res.type('.css');
    res.sendFile(path.join(__dirname + "/css/Saino.css"));
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









const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);

app.get("/contract.js", (req, res) => {
    res.type('.js');
    res.sendFile(path.join(__dirname + "/contract.js"));
})