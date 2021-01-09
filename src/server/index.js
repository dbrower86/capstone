// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const { request } = require('http');

// Start up an instance of app
const port = 8000;
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
app.listen(port, () => {
    console.log(`Listening on port:${port}`)
})

app.get('/all', (request, response) => {
    response.send(projectData);
    console.log('get');
    console.log(projectData);
})

app.post('/add', (request, response) => {
    let newData = request.body;
    let newEntry = {
        temp: newData.temp,
        date: newData.date,
        feelings: newData.feelings
    }
    projectData = newEntry;
    console.log('post');
    console.log(projectData);
})