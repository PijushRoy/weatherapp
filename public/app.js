const condition = document.getElementById('condition-icon')
const city = document.getElementById('city')
const country = document.getElementById('country')
const mainText = document.getElementById('main')
const description = document.getElementById('description')
const temp = document.getElementById('temp')
const pressure = document.getElementById('pressure')
const humidity = document.getElementById('humidity')

const cityInput = document.getElementById('city-input')
const historyElm = document.getElementById('history')
const masterHistory = document.getElementById('master-history')

const API_KEY = `3d98043d9bd897178517fd96ec5fb0b3`
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`
const ICON_URL = `http://openweathermap.org/img/wn/`
const DEFAULT_CITY = `narayanganj,bd`

window.onload = function () {
    navigator.geolocation.getCurrentPosition(s => {
        getWeatherData(null, s.coords)
    }, e => {
        getWeatherData()
    })


    axios.get('/api/history')
        .then(({
            data
        }) => {
            if (data.length > 0) {
                updateHistory(data)
            } else {
                historyElm.innerHTML = 'There is No History'
            }
        })
        .catch(e => {
            console.log(e)
            alert('Error Occurred')
        })


    cityInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (e.target.value) {
                getWeatherData(e.target.value, null, weather => {
                    e.target.value = ''
                    axios.post('/api/history', weather)
                        .then(({
                            data
                        }) => updateHistory(data))
                        .catch(e => {
                            console.log(e)
                            alert('Error Occurred')
                        })
                })
            } else {
                alert('Please Provide a Valid City Name')
            }
        }
    })
}
// & = amparcent
// q = query
function getWeatherData(city = DEFAULT_CITY, coords, cb) {
    let url = BASE_URL

    city === null ? url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}` : url = `${url}&q=${city}`

    axios.get(url)
        .then(({
            data
        }) => {
            let weather = {
                icon: data.weather[0].icon,
                name: data.name,
                country: data.sys.country,
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: data.main.temp,
                pressure: data.main.pressure,
                humidity: data.main.humidity
            }

            setWeather(weather)
            if (cb) cb(weather)
        })
        .catch(e => {
            console.log(e)
            alert('City Not Found')
        })
}

function setWeather(weather) {
    condition.src = `${ICON_URL}${weather.icon}.png`;
    city.innerHTML = weather.name;
    country.innerHTML = weather.country;
    mainText.innerHTML = weather.main;
    description.innerHTML = weather.description;
    temp.innerHTML = Math.round((((weather.temp - 273.15) * 1.8) + 32 - 32) / 1.8) + '&#8451;';
    pressure.innerHTML = weather.pressure / 1000 + 'kpa';
    humidity.innerHTML = weather.humidity + '%';
}

function updateHistory(history) {
    historyElm.innerHTML = ''
    history = history.reverse()

    history.forEach(h => {
        let tempHistory = masterHistory.cloneNode(true)
        tempHistory.id = ''
        tempHistory.getElementsByClassName('condition')[0].src = `${ICON_URL}${h.icon}.png`
        tempHistory.getElementsByClassName('city')[0].innerHTML = h.name
        tempHistory.getElementsByClassName('country')[0].innerHTML = h.country
        tempHistory.getElementsByClassName('main')[0].innerHTML = h.main
        tempHistory.getElementsByClassName('description')[0].innerHTML = h.description
        tempHistory.getElementsByClassName('temp')[0].innerHTML = Math.round((((h.temp - 273.15) * 1.8) + 32 - 32) / 1.8) + '&#8451;'
        tempHistory.getElementsByClassName('pressure')[0].innerHTML = h.pressure / 1000 + 'kpa'
        tempHistory.getElementsByClassName('humidity')[0].innerHTML = h.humidity + '%'

        historyElm.appendChild(tempHistory)
    })
}