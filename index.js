// fetching parameters
// usertab using custom attribute
const userTab = document.querySelector("[data-userWeather]");
// searchtab using custom attribute
const searchTab = document.querySelector("[data-searchWeather]");
// usercontainer using custom attribute
const userContainer = document.querySelector(".weather-container");
// access using custom attribute 
const grantAccessContainer = document.querySelector(".grant-location-container");
// search form using custom attribute
const searchForm = document.querySelector("[data-searchForm]");
// loading screen using class method
const loadingScreen = document.querySelector(".loading-container");
// user info using class method
const userInfoContainer = document.querySelector(".user-info-container");

//(refresh karisu tohh usertab ma j avisu)
let oldTab = userTab;
// my API key
const API_KEY = "f5e59175b244c955ecbc05a4074214b6";
// mara current tab ni class list ma property add karva
oldTab.classList.add("current-tab");
getfromSessionStorage();

// jyare apde koi tab pr click karisu tyare switch thse
function switchTab(newTab) {
    // jo new tab a old tab ne equal na hoyy to
    if(newTab != oldTab) {
        // current tab ni property durr karse
        oldTab.classList.remove("current-tab");
        // jo old tab n new tab same hse tohh property ejj rehse
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        // kaya tab pr che te janva mate
        // jo search form in andar active nathi thau
        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            userInfoContainer.classList.remove("active");
            // storage ma save cordinates lese
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    // jo local userCoordinates na male tohh
    if(!localCoordinates) {
        //access valu page khulse
        grantAccessContainer.classList.add("active");
    }
    // jo available hse local coordinates tohh
    else {
        // ano use karo
        const coordinates = JSON.parse(localCoordinates);
        // user na weather ne fetch karse
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    // lat n lon ni value lese
    const {lat, lon} = coordinates;
    // make grantAccessContainer invisible
    grantAccessContainer.classList.remove("active");
    // make loadingScreen visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        // converting in json form
        const  data = await response.json();
        // to remove loader screen
        loadingScreen.classList.remove("active");
        // making waether info visible
        userInfoContainer.classList.add("active");
        // render value on UI
        renderWeatherInfo(data);
    }
    catch(err) {
        // remove loader screen
        loadingScreen.classList.remove("active");
    }

}

function renderWeatherInfo(weatherInfo) {

    //fistly, we have to fethc the elements in weatherInfo
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    // printing weatherInfo
    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    // city name ni ander weather info pass kari
    cityName.innerText = weatherInfo?.name;
    // pehla weather info ma hata tya thi sys ma gaya tya thi country ma gaya n j value mali a flag ma convert karavi
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // weatherinfo ma jase tya thi pehla element ma jse n tya thi description ma jse
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    // pehla weather info ma jse tya thi pehla index ma jse n tya thi value(icon) lese
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    // weather info => main ma => temp ma
    // display value with c use `${....} text `; syntex
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    // weather info => wind => speed
    // display value with c use `${....} text `; syntex
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    // weatherInfo => main => humidity
    // display value with c use `${....} text `; syntex
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    // weatherInfo => clouds => all
    // display value with c use `${....} text `; syntex
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// checking if geolocation is sipportive or not
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supportvive");
    }
}

// lat n lon na parameters lidha
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    // store this parameters,converting in json form
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // display on UI
    fetchUserWeatherInfo(userCoordinates);

}

// fetch data
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

// fetch data
const searchInput = document.querySelector("[data-searchInput]");
// jyare submit thay tyare erro function active thse
searchForm.addEventListener("submit", (e) => {
    // default method ne hatavi dese
    e.preventDefault();
    let cityName = searchInput.value;

    // jo city nu naam empty hse tohh kai nai kare
    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

// ek function ni ander city pass kari
async function fetchSearchWeatherInfo(city) {
    // loader page active thse
    loadingScreen.classList.add("active");
    // userinfo page remove kariu
    userInfoContainer.classList.remove("active");
    // grantacess valu page pn remove kariu
    grantAccessContainer.classList.remove("active");

    // calling APPI
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );

        // data ne json form ma convert kario
        const data = await response.json();
        // value malta loader page ne remove karse
        loadingScreen.classList.remove("active");
        // userinfo ppage open thse
        userInfoContainer.classList.add("active");
        // value UI pr render thse
        renderWeatherInfo(data);
    }
    catch(err) {
       
    }
}