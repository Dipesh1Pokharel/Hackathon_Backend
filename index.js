const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const axiosRetry = require('axios-retry');
// const fetch = require('node-fetch')  ;
const multer = require('multer');
const https = require('https'); 
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json({limit: '1000mb'}));

app.listen(PORT, ()=>{
    console.log("Server Started");
})