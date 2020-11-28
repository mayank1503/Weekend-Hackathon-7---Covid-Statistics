const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
let data=require('./data.js');
data=data['data'];
// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')
app.get('/totalRecovered',(req,res)=>{
  let answer=0;
  for(let i=0;i<data.length;i++){
      let stateData=data[i];
      answer+=Number(stateData['recovered']);
  }
  res.json({data: {_id: "total", recovered:answer}});
});
app.get('/totalActive',(req,res)=>{
  let recovered=0;
  let infected=0;
  for(let i=0;i<data.length;i++){
    let stateData=data[i];
    recovered+=Number(stateData['recovered']);
    infected+=Number(stateData['infected']);
}
res.json({data: {_id: "total", active: infected-recovered}})
});

app.get('/totalDeath',(req,res)=>{
    let dead=0;
  for(let i=0;i<data.length;i++){
      let stateData=data[i];
      dead+=Number(stateData['death']);
  }
  res.json({data: {_id: "total", recovered:dead}});

});
app.get('/ hotspotStates',(req,res)=>{
    let dead = [];
    for (let i = 0; i < data.length; i++) {
        let k = data[i];
        let infected = k['infected'];
        let recovered = k['recovered'];
        let diff = Number(infected) - Number(recovered);
        diff = (diff / Number(infected));
        diff = diff.toFixed(5);
        console.log(diff);
        if (diff > 0.1) {
            dead.push({ state: k['state'], rate: diff });
        }
    }
    res.json({ data: dead });

});
app.get('/ healthyStates',(req,res)=>{

    let dead = [];
    for (let i = 0; i < data.length; i++) {
        let k = data[i];
        let infected = k['infected'];
        let death = k['death'];
        let diff = (Number(death) / Number(infected));
        diff = diff.toFixed(5);
        if (diff < 0.05) {
            dead.push({ state: k['state'], mortality: diff });
        }
    }
    res.json({ data: dead });

});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;