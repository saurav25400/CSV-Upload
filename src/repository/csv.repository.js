import { getDb } from "../../DbConfig/db.config.js"


export class CsvRepository{
    constructor(){
        this.collectionName='csvInfo'
    }
    async postFile(filename){
        try{
            const db=getDb();
            const result=await db.collection(this.collectionName).insertOne({'csvFileName':filename});
            console.log("file inserted to mongodb successfully");

            return {success:true}
        }
        catch(error){
            console.log(error);
        }
    }
    async getFile(){
        try{
            const db=getDb();
            const result=db.collection(this.collectionName).find({}).toArray();
            return result;

        }
        catch(error){

            console.log(error);
        }
    }
    // async sendFileData(filename){

        
    // }
}