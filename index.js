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
const storage = multer.memoryStorage();
const upload =  multer({
    storge: storage,
    limits : {fileSize: 10000000000}
  });
  const router = express.Router();

app.use(cors());
app.use(bodyParser.json({limit: '1000mb'}));


//GET PRODUCTS
app.use('/getProducts', async (req, res)=>{
    try{
        const response = await axios.get('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place',
        {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"
            }
        });
        res.json(response.data);

    }
    catch(err){
        res.status(500).send("Internal Server Error.");
    }
});

//POST PRODUCTS
app.use('/addProducts', upload.single('image'), async (req, res)=>{
    try{
         // Extract product data from request body
      const productData = req.body;
      
      // Extract image buffer from the request file
      const imageBuffer = req.file.buffer;
      
      // Encode image buffer to base64
      const base64Image = imageBuffer.toString('base64');
  
      // Add base64 image to product data
      productData.image = base64Image;
  
      // Send product data to DataStax database
        const response = await axios.post('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place',
         productData,
        {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325",
                "Content-Type": "application/json"
            }
        });
        res.json(response.data);

    }
    catch(err){
        res.status(500).send("Internal Server Error.");
    }
});

//Delete Product
app.use('/deleteProducts/:documentId', async(req, res)=>{
    try{
        const documentId= req.params.documentId;
        const response = await axios.delete(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place/${documentId}`,
        {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"
            }
        });
        res.status(200).send("Staus: Succeed");

    }
    catch(err){
        res.status(500).send("Internal Server Error, Couldnot Delete file");
    }

});

//UPDATE PRODUCTS

app.use('/updateProducts/:documentId', async (req, res)=>{
    try{
      const  documentId = req.params.documentId;
         // Extract product data from request body
      const updatedData = req.body;
      
      // Extract image buffer from the request file
    //   const imageBuffer = req.file.buffer;
      
    //   // Encode image buffer to base64
    //   const base64Image = imageBuffer.toString('base64');
  
    //   // Add base64 image to product data
    //   updatedData.image = base64Image;
  
      // Send product data to DataStax database
        const response = await axios.put(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place/${documentId}`,
         updatedData,
        {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325",
                "Content-Type": "application/json"
            }
        });
        res.json(response.data);

    }
    catch(err){
        res.status(500).send("Internal Server Error.");
    }
});
//api for events of environmenmt programss

app.get('/api/events/:name', async(req, res) => {
  const name = req.params.name;
  // console.log(name);
  const options = {
    method: 'GET',
    url: 'https://real-time-events-search.p.rapidapi.com/search-events',
    params: {
      query: `Environment Programs in ${name}`,
      start: '0'
    },
    headers: {
      'X-RapidAPI-Key': 'f8cd9c8bd9msh6e6d921717b0838p13ad61jsnc3c23603d782',
      'X-RapidAPI-Host': 'real-time-events-search.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

//Chat GPT API
app.post('/chatBot', async(req, res) => {
    // const name = req.params.name;
    const prompt = JSON.stringify(req.body);
    const data = "you are required to answer the questions related to only environment and climate"+ prompt;
    
    // console.log(name);
    const options = {
        method: 'POST',
        url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'f8cd9c8bd9msh6e6d921717b0838p13ad61jsnc3c23603d782',
          'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
        },
        data: {
          messages: [
            {
              role: 'user',
              content: data
            }
          ],
          web_access: false,
          system_prompt: '',
          temperature: 0.9,
          top_k: 5,
          top_p: 0.9,
          max_tokens: 256
        }
      };
      
      try {
          const response = await axios.request(options);
        //   console.log(response.data);
        res.send(response.data);
      } catch (error) {
          console.error(error);
      }
    });
    //EVENTS API

    app.get('/api/events/:name', async(req, res) => {
        const name = req.params.name;
        // console.log(name);
        const options = {
          method: 'GET',
          url: 'https://real-time-events-search.p.rapidapi.com/search-events',
          params: {
            query: `Environment Programs in ${name}`,
            start: '0'
          },
          headers: {
            'X-RapidAPI-Key': 'f8cd9c8bd9msh6e6d921717b0838p13ad61jsnc3c23603d782',
            'X-RapidAPI-Host': 'real-time-events-search.p.rapidapi.com'
          }
        };
      
        try {
          const response = await axios.request(options);
          // console.log(response.data);
          res.json(response.data);
        } catch (error) {
          console.error(error);
        }
      })
      




app.listen(PORT, ()=>{
    console.log("Server Started");
})