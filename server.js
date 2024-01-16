import express from 'express';
import path from 'path';
import './env_config.js';
import { fileURLToPath } from 'url';
import connectToMongoDb from './DbConfig/db.config.js';
import { upload } from './src/middlewares/fileUpload.middleware.js';
import { CsvController } from './src/controllers/csv.controller.js';

const app=express();
//configuring cors policy
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    next();
  })
  
//configuring static files
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.use(express.static(path.join(__dirname,'frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend','html', 'index.html'));
  });
  app.get("/table",(req,res,next)=>{
    res.sendFile(path.join(__dirname,'frontend','html','table.html'));
  })

// calling contoller class
const csvContoller=new CsvController();
app.post("/file-upload",upload.single('csvFile'),(req,res,next)=>{
    csvContoller.postFile(req,res,next);
});
app.get("/csv-data",(req,res,next)=>{
    csvContoller.sendFileData(req,res,next);
})
app.get("/get-uploaded-files",(req,res,next)=>{
    csvContoller.getFile(req,res,next);
})









app.listen(3000,(req,res)=>{
    console.log("server is listening at port 3000");
    connectToMongoDb();
})