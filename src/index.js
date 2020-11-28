const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get("/totalRecovered", (req, res) => {
    let count = 0;
    connection.find().then(post => {
        post.map(element => {
            count += element.recovered;
        });
        res.send({data: {_id: "total", recovered:count}});
    })
})

app.get("/totalActive", (req, res) => {
    let count = 0;
    connection.find().then(post => {
        post.map(element => {
            count += (element.infected - element.recovered);
        });
        res.send({data: {_id: "total", active:count}});
    })
});

app.get("/totalDeath", (req, res) => {
    let count = 0;
    connection.find().then(post => {
        post.map(element => {
            count += (element.death);
        });
        res.send({data: {_id: "total", death:count}});
    })
});

app.get("/hotspotStates", (req, res) => {
    let count = 0;
    let arr = [];
    connection.find().then(post => {
        post.map(element => {
            let rate = ((element.infected - element.recovered)/ element.infected).toFixed(5);
            if( rate > 0.1){
                arr = [...arr, {state: element.state, rate: rate}] 
            }
        })
        return arr;
    }).then(arr => res.send({data: arr}));
});

app.get("/healthyStates", (req, res) => {
    let count = 0;
    let arr = [];
    connection.find().then(post => {
        post.map(element => {
            let rate = ((element.infected - element.recovered)/ element.infected).toFixed(5);
            if( rate < 0.005){
                arr = [...arr, {state: element.state, rate: rate}] 
            }
        })
        return arr;
    }).then(arr => res.send({data: arr}));
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;