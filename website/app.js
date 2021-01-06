/* Global Variables */
const key = ',us&appid=ce62966fa4ec5941f43072a50bb4bebc';
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';

// example: api.openweathermap.org/data/2.5/weather?zip=94040,us&appid={API key}


function genClick() {

    const zip = document.getElementById('zip').value;
    getWeather(baseUrl, zip, key)
    .then(function(data) {
        const kelvin = data.main.temp;
        let degF =(( kelvin - 273.15) * 9/5) + 32;
        degF = Math.trunc(degF);

        // Create a new date instance dynamically with JS
        let d = new Date();
        let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

        let feelings = document.getElementById('feelings').value;

        let newData = {temp:degF, date:newDate, feelings:feelings};
        
        console.log(newData);
        postData('http://localhost:8000/add', newData)
    })
    .then(function() {
        updateUI('http://localhost:8000/all')
    });
}

function postIt(data)
{
    const kelvin = data.main.temp;
    let degF =(( kelvin - 273.15) * 9/5) + 32;
    degF = Math.trunc(degF);

    // Create a new date instance dynamically with JS
    let d = new Date();
    let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

    let feelings = document.getElementById('feelings').value;

    let newData = {temp:degF, date:newDate, feelings:feelings};
    
    postData('http://localhost:8000/add', newData);
    console.log(newData);
}

const postData = async ( url = '', data = {})=>{

    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        return newData;
    }catch(error) {
        console.log("error", error);
    }
};


const updateUI = async (url = '') => {

    const request = await fetch(url);
    try{
      const allData = await request.json();
      console.log(allData);
      document.getElementById('date').innerHTML = allData.date;
      document.getElementById('temp').innerHTML = allData.temp;
      document.getElementById('content').innerHTML = allData.feelings;
  
    }
    catch(error){
      console.log("error", error);
    }
  }

const getWeather = async (baseURL, zip, key)=>{

    const res = await fetch(baseURL+zip+key)
    try {
      const data = await res.json();
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

document.getElementById('generate').addEventListener("click", genClick);