
// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { response } = require('express');
const { request } = require('http');

dotenv.config();
// Start up an instance of app
const port = 8081;
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

app.get('/keys', (request, response) => {
    let data = {
        wth_key: process.env.WTH_KEY, 
        pix_key: process.env.PIX_KEY,
        geo_name: process.env.GEO_NAME
    }
    response.send(data);
})

