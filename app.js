require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./src/geocode');
const forecast = require('./src/forecast');
const app = express();
const port = process.env.PORT || 3000;
const name = 'Fabian';

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name,
        helpText: 'There should be some useful information but it is not there :('
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name,
        error: 'Help article not found.'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "Address must be provided."
        });
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error
            });
        }
        forecast(latitude, longitude, (error, {forecast} = {}) => {
            if(error){
                return res.send({
                    error
                });
            }
            res.send({
                location,
                forecast,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) =>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide search term'
        });
    }
    console.log(req.query.search);
    res.send({
       products : []
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name,
        error: 'Page not found.'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});