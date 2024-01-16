import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { CsvRepository } from "../repository/csv.repository.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CsvController{
    constructor(){
        this.csvRepository=new CsvRepository();
    }
    async postFile(req,res,next){
        try{
            const csvFile=req.file.filename;
           const result= await this.csvRepository.postFile(csvFile);
        if(result.success){
            return res.status(200).send("file inserted to database successfully")
        }
        else{
            return res.status(400).send("failed to insert");
        }

        }
        catch(error){
            console.log(error);
        }
    }
    async getFile(req,res,next){
        try{
            const result=await this.csvRepository.getFile();
            return res.status(200).json(result);

        }
        catch(error){
            console.log(error);
        }
    }
    
    async sendFileData(req,res,next){
        try{
            const fileName=req.query.filename;
        const filePath = path.join(__dirname, '..', '..', 'upload', fileName);

        // console.log(`File path: ${filePath}`);

            if(fs.existsSync(filePath)){
                const result=[];
            fs.createReadStream(filePath).pipe(csv()).on('data',(data)=>{
                result.push(data);
            }).on('end',()=>{
                return res.status(200).json(result); 
            })
            }
            else{
                return res.status(400).send("could not able to parse data");
            }
        }
        catch(error){
            console.log(error);
            res.status(500).send("An error occurred while processing your request.");

        }
    }
}