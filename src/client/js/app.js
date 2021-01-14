/* Global Variables */
const apiKeyUrl = 'http://localhost:8081/keys';
const apiPostUrl = 'http://localhost:8081/add';
const apiGeoUrl = 'http://api.geonames.org/searchJSON?maxRows=1&q=';
const forecastUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const normalUrl = 'https://api.weatherbit.io/v2.0/normals?';
const pixUrl = 'https://pixabay.com/api/?image_type=photo&q='
const wth_icon_base = 'https://www.weatherbit.io/static/img/icons/'

let wth_key;
let pix_key;
let geo_name;

const genClick = async()=> {
    let lat,lng,countryName;  // geonames
    let high,low,wth,icon;    // weatherbit
    let photo;                // pixabay

    const city = document.getElementById('city').value;
    if(city.length == 0) {
      alert('Please Enter City');
      return;
    }

    const dateString = document.getElementById("datefield").value;
    if( !isValidDate(dateString) ) {
      alert('Please Enter Valid Date');
      return;
    }

    const deltaDays = getDeltaDays(dateString);
    if( deltaDays < 0 ) {
      alert('Please Enter Current or Future Date');
      return;
    }

    try{
      let data = await getGeoData( city );
      lat = data.geonames[0].lat;
      lng = data.geonames[0].lng;
      countryName = data.geonames[0].countryName;
    }
    catch{
      alert('City Not Found');
      return;
    }

    if(deltaDays < 16) {
      try {
        let data = await getForecast( lat, lng );
        high = data.data[deltaDays].max_temp;
        low = data.data[deltaDays].min_temp;
        wth = data.data[deltaDays].weather.description;
        icon = data.data[deltaDays].weather.icon;
      }
      catch {
        alert('Failed to get Forecast');
        return;
      }
    }
    else {
      try {
        let data = await getNormal( lat, lng, dateString );
        high = data.data[0].max_temp;
        low = data.data[0].min_temp;
        wth = '';
        icon = 0;
      }
      catch {
        alert('Failed to get Weather');
        return;
      }
    }
    try {
      let data = await getPicture( city );
      let max = Math.min(data.totalHits, 20);
      let rand = Math.floor(Math.random() * max);
      photo = data.hits[rand].webformatURL;
    }
    catch {
      alert('Failed to get Picture');
      return;
    }

    updateUI( high, low, wth, icon, city, countryName, dateString, photo );
    updateServer(city, dateString);    
}

function updateUI(high, low, wth, icon, city, countryName, dateString, photo)  {
  document.getElementById('tripCity').innerHTML = 'Destination: ' + city.replace(/\b\w/g, l => l.toUpperCase()) + ', ' + countryName;
  document.getElementById('tripDate').innerHTML = 'Date: ' + dateString;
  document.getElementById('tripHigh').innerHTML = 'High: ' + Math.round(high)  + ' &deg;F';
  document.getElementById('tripLow').innerHTML = 'Low: ' + Math.round(low)  + ' &deg;F';
  document.getElementById('tripWth').innerHTML = wth;
  document.getElementById('tripImage').src = photo;
  if(icon==0) {
    document.getElementById('tripIcon').hidden = true;
  }
  else {
    document.getElementById('tripIcon').src = wth_icon_base + icon + '.png';
    document.getElementById('tripIcon').hidden = false;
  }
}

const getPicture = async(city)=>{

  const str = pixUrl + `${city}&key=${pix_key}`;
  const res = await fetch(str)
  try {
    const data = await res.json();
    return data;
  } catch(error) {
      console.log("error", error);
      // appropriately handle the error
  }  
}

const getForecast = async(lat, lng)=>{

  const str = forecastUrl + `lat=${lat}&lon=${lng}&units=I&key=${wth_key}`;
  const res = await fetch(str)
  try {
    const data = await res.json();
    return data;
  } catch(error) {
      console.log("error", error);
      // appropriately handle the error
  }  
}

const getNormal = async(lat, lng, dateString)=>{

  let parts = dateString.split("/");
  let startMMDD = parts[0] + '-' + parts[1];

  const str = normalUrl + `lat=${lat}&lon=${lng}&start_day=${startMMDD}&end_day=${startMMDD}&units=I&key=${wth_key}`;
  const res = await fetch(str)
  try {
    const data = await res.json();
    return data;
  } catch(error) {
      console.log("error", error);
      // appropriately handle the error
  }  
}

const getAPIkeys = async ( data = {})=>{

    const res = await fetch(apiKeyUrl)
    try {
      const data = await res.json();
      wth_key = data.wth_key;
      pix_key = data.pix_key;
      geo_name = data.geo_name;
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

const getGeoData = async ( city )=>{

    const res = await fetch(apiGeoUrl+city+'&username='+geo_name)
    try {
      const data = await res.json();
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
}

// from https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript/49178339
function isValidDate(dateString)
{
  // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return false;
    }

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12) {
      return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

function getDeltaDays(dateString)
{
  var parts = dateString.split("/");
  var day = parseInt(parts[1], 10);
  var month = parseInt(parts[0], 10);
  var year = parseInt(parts[2], 10);

  let date1 = new Date(year, month-1, day);
  let today = new Date();
  let delta = date1.getTime() - today.getTime();
  let days = delta / (1000 * 3600 * 24);
  return Math.ceil(days);
}

const updateServer = async ( city, date )=> {

  let data = {city:city, date:date};

  const response = await fetch(apiPostUrl, {
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
  }
  catch(error) {
    console.log("error", error);
  }
};


function main() {
  document.addEventListener('DOMContentLoaded', () => {
    //event listeners here
    document.getElementById('generate').addEventListener("click", genClick);
  })
  getAPIkeys();
}

export{ main };
export { isValidDate }; // for test