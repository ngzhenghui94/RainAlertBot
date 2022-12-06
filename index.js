// Import the required libraries
const telegram = require('telegram-bot-api');
const schedule = require('node-schedule');
const axios = require('axios');
const moment = require('moment-timezone');
const dotenv = require('dotenv');
moment().tz("Singapore").format();
dotenv.config();

// Define the API token for the Telegram bot
const teleApiToken = process.env.TELEAPI;
const openApiToken = process.env.WEATHERAPI;

// Initialize the Telegram bot and set a webhook
const bot = new telegram({
    token: teleApiToken,
    webhook: {
        url: `https://api.telegram.org/bot${teleApiToken}/getWebhookInfo`,
    },
});

// Lat and Long of Singapore
const geoloc = {
    lat: 1.3521,
    lon: 103.8198,
}

const openApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geoloc.lat}&lon=${geoloc.lon}&appid=${openApiToken}`
console.log(openApiUrl)


// Define the function to check the weather and send a message
function check_weather() {

    // Axios call to the OpenWeatherMap API and check if it is going to rain
    axios.get(openApiUrl)
        .then((response) => {
            const weather = response.data.weather[0].main;
            if (weather === 'Rain') {
                bot.sendMessage({
                    chat_id: '@SingaporeWeather',
                    text: `At <i>${moment().format("DDMMYY HH:mm")}</i>: It is going to rain. Remember to bring an umbrella!`,
                    parse_mode: 'HTML',
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


// Schedule the function to be called every 5 minutes
schedule.scheduleJob('*/5 * * * *', check_weather);

bot.sendMessage({
    chat_id: '@SingaporeWeather',
    text: `At <i>${moment().format("DDMMYY HH:mm")}</i>, Bot initialized/Reloaded.`,
    parse_mode: 'HTML',
});
