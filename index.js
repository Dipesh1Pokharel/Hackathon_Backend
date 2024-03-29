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
    limits : {fileSize: 1000 *1024 * 1024}
  });
  const router = express.Router();

app.use(cors());
app.use(bodyParser.json({limit: '10000mb'}));


//GET PRODUCTS
app.use('/getProducts/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const response = await axios.get(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place/${id}`,
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
app.use('/getProducts', async (req, res)=>{
    try{
        const response = await axios.get('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place?page-size=20',
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
        // res.status(500).send("Internal Server Error.");
        console.log(err);
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
       
      const updatedData = req.body;
      
      
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
//patch
app.use('/patch/:id', async (req, res)=>{
   
   try{
    const id = req.params.id;
    const update = req.body;
    const response = await axios.patch(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place/${id}`, 
    update,
    {
        headers:{
            "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325",
                "Content-Type": "application/json"
        }
        
    });
    res.json(response.data);

   } 
   catch(err){
        res.send(err);
   }

});
//Call this endpoint to get current earnings

app.use('/getEarnings', async(req, res)=>{
    try{
        
        const response = await axios.get('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place/35824570-fbc8-4736-bf80-6ccb6573d3e7',
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

})
//Call this endpoint to chnange earnings....
app.use('/addEarnings', async (req, res)=>{
    
    try{
        const newEarning = req.body;
        const response = await axios.put('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/market_place/35824570-fbc8-4736-bf80-6ccb6573d3e7',
        newEarning, 
        {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"

            }
        });
        res.json(response.data);
    }
    catch(err){
        res.send(err);
    }
})
//api for events of environmenmt programss
//change api

app.get('/api/events', async(req, res) => {
//   const city = req.params.city;
  // console.log(name);
  const options = {
    method: 'GET',
    url: 'https://real-time-events-search.p.rapidapi.com/search-events',
    params: {
      query: `Seminars and Programmes related to water pollution in Canada`,
      start: '0'
    },
    headers: {
      'X-RapidAPI-Key': 'de64272d9dmsh23d51588da4d710p19c63djsn0ef6c7cfcd0f',
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
    const data = "Considering yourself as a environmental health specialist you are required to answer the questions in the way that it coincides with environmental health"+ prompt;
    
    // console.log(name);
    const options = {
        method: 'POST',
        url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'de64272d9dmsh23d51588da4d710p19c63djsn0ef6c7cfcd0f',
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
    

   
//Get NEWS

app.get("/api/news", async(req, res)=>{
    const options = {
        method: 'GET',
        url: 'https://google-news13.p.rapidapi.com/search',
        params: {
          keyword: 'Water Pollution in Canada',
          lr: 'en-US'
        },
        headers: {
          'X-RapidAPI-Key': 'd46e327e9dmsh0e42ec9fd43c7aep146004jsn271296d58203',
          'X-RapidAPI-Host': 'google-news13.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          res.send(response.data);
        } catch (error) {
          console.error(error);
      }
});

//Report APi
app.use('/report', upload.single('image') ,async(req, res)=>{
    try{
        // Extract product data from request body
     const reportData = req.body;
     
     // Extract image buffer from the request file
     const imageBuffer = req.file.buffer;
     
     // Encode image buffer to base64
     const base64Image = imageBuffer.toString('base64');
 
     // Add base64 image to product data
     reportData.image = base64Image;
 
     // Send product data to DataStax database
       const response = await axios.post('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/reports',
        reportData,
       {
           headers:{
               "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325",
               "Content-Type": "application/json"
           }
       });
       res.json(response.data);

   }
   catch(err){
       // res.status(500).send("Internal Server Error.");
       console.log(err);
   }

});

//GET REPORTS

app.use('/getReports', async(req, res)=>{
    try{
        const response = await axios.get('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/reports?page-size=20', {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"

            }
        });
        res.json(response.data);

    }
    catch(err){
        res.status(500).send(err);
    }
});

//Delete Reports

app.use('/deleteReports/:documentId', async(req,res)=>{
    try{
        const documentId = req.params.documentId;
        const response = await axios.delete(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/reports/${documentId}`,{
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"

            }
        });
        res.send("deleted sucessfully");
    }
    catch(err){
        res.status(500).send(err);
    }
});

//get users by useranme and password
app.use('/getUser/:username/:password', async (req, res)=>{
    try{
        const username = req.params.username;
        const password = req.params.password;
        const response = await axios.get(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/users?where=%7B%20%20%22username%22%3A%20%7B%20%20%20%20%22%24eq%22%3A%20%22${username}%22%20%20%7D%2C%20%20%22password%22%3A%20%7B%20%20%20%20%22%24eq%22%3A%20%22${password}%22%20%20%7D%7D&page-size=3`,
        {
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"

            }
        });
        res.json(response.data);
    }
    catch(err){
        res.send(err);
    }
});

//Get Users

app.use("/getUsers", async(req, res)=>{
    try{
        const response = await axios.get('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/users?page-size=20',{
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325"

            }
        });
        res.json(response.data);
    }
    catch(err){
        res.send(err);
    }

});

//Add Users

app.use("/addUsers", upload.single('image'), async(req, res)=>{
    try{
         
        const usersData= req.body;
        const imageBuffer = req.file.buffer;
      
      // Encode image buffer to base64
      const base64Image = imageBuffer.toString('base64');
  
      // Add base64 image to product data
      usersData.image = base64Image;
        const response = await axios.post('https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/users',
        usersData,{
            headers:{
                "X-Cassandra-Token": "AstraCS:yjODPdZPFzxpapHYONHMOXmW:8072c8b56252e8e784d43454e35e861e0a899a9242e94aa8f5f0725b90b5f325",
                "Content-Type": "application/json"
            }
        });
        res.json(response.data);
        
    }
    catch(err){
        res.status(500).send(err);

    }
});

//EDIT USERS

app.use('/updateUsers/:documentId', async (req, res)=>{
    try{
      const  documentId = req.params.documentId;
      const updatedData = req.body;
      const imageBuffer = req.file.buffer;   
      const base64Image = imageBuffer.toString('base64');

        updatedData.image = base64Image;
  
      // Send product data to DataStax database
        const response = await axios.put(`https://2243afd2-4437-4abf-a830-478abccb1d3f-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/users/${documentId}`,
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