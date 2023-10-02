if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/stock/search',(req,res)=>{
    res.render('search');
})

app.post('/stock/result', async (req,res)=>{
    const apiKey = process.env.ALPHA_KEY;
    const symbol = req.body.stock.name;
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}.BSE&apikey=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const dailyData = data['Time Series (Daily)'];

    // Get the latest trading day's data
    const latestTradingDay = Object.keys(dailyData)[0];
    const latestQuote = dailyData[latestTradingDay];

    res.render('result',{symbol,latestTradingDay,latestQuote})
})

const port = process.env.PORT || 8080;

app.listen(port, ()=>{
    console.log(`Serving on port ${port}`);
})