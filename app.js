const express = require('express');
const request = require('./util/request');
const PORT = process.env.PORT || 5000;
const app = express();
const {findDaGoodDeal} = require('./src/do-stats');

const requestConfig = {
    url: "https://www.autotrader.com/rest/v1/alphashowcase/base",
    method: "GET",
    timeout: 10000,
    qs: {
        zip: "11234",
        startYear: "2015",
        endYear: "2015",
        makeCodeList:"HONDA",
        searchRadius: "75",
        modelCodeList:"CRV",
        sortBy: "relevance",
        numRecords: "25",
        firstRecord: "0"
    },
    headers: {
        "Accept": "application/json",
        "User-Agent": "curl/7.54.0",
    }
}

app.get('/', (async (req, res) => {
    let carData;
    try {
        carData = await request(requestConfig);
        res.set('Content-Type', 'text/html');
        const bestDeal = findDaGoodDeal(carData.alphaShowcase);
        res.status(200).send(
            `<html>
                <head>
                    <style>
                        td {
                            padding: 15px;
                            text-align: left;
                        }
                        table {
                            border: 1px solid black;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <tr style='font-weight: bold'>
                            <td>Description</td>
                            <td>Price</td>
                            <td>Mileage</td>
                            <td>Dealer name</td>
                            <td>Link</td>
                        </tr>
                        <tr>
                            <td>${bestDeal.description.label}</td>
                            <td>${bestDeal.pricingDetail.first}</td>
                            <td>${bestDeal.specifications.mileage.value}</td>
                            <td>${bestDeal.owner.name}</td>
                            <td><a href='https://autotrader.com${bestDeal.website}'>Link to listing</a></td>
                        </tr>
                    </table>
                </body>
            </html>`);
    } catch (err) {
        res.status(400).send(`Something bad: '${err.message}'`);
    }
}));

app.listen(PORT, () => console.log(`listening on port ${PORT}.`))
