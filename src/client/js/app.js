/* Global Variables */
const baseUrl = 'http://api.geonames.org/geoCodeAddressJSON?q=';
const userName = '&username=danbrower';

// example: http://api.geonames.org/geoCodeAddressJSON?q=calabasas&username=danbrower

function genClick() {

    const city = document.getElementById('city').value;
    getWeather(baseUrl, city, userName)
    .then(function(data) {
        console.log(data);
        console.log(data.address.countryCode)
        console.log(data.address.lat)
        console.log(data.address.lng)
        postData('http://localhost:8000/add', data)
    })
    .then(function(res) {
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

const getWeather = async (baseURL, city, user)=>{

    const res = await fetch(baseURL+city+user)
    try {
      const data = await res.json();
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

document.getElementById('generate').addEventListener("click", genClick);

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("datefield").setAttribute("min", today);