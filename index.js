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






app.listen(PORT, ()=>{
    console.log("Server Started");
})