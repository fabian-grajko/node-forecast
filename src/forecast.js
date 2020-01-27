const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${latitude},${longitude}?units=si`
    request({
            url,
            json: true
        },
        (error, { body }) => {
            if(error){
                callback('Unable to connect to weather service', undefined);
            } else if(body.error){
                callback('Unable to find location', undefined);
            } else {
                callback(undefined, {
                    forecast: body.daily.data[0].summary +
                        ` It is currently ${body.currently.apparentTemperature}°C out.` +
                        ` There is a ${body.currently.precipProbability}% chance of rain today.`
                });
            }
        });
};

module.exports = forecast;