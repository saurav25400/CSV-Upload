import { MongoClient } from "mongodb";
let clients;
const connectToMongoDb=()=>{
    MongoClient.connect(process.env.DB_URL).then((mongoClient)=>{
        clients=mongoClient;
        console.log("connected to mongodb successfully");
    }).catch((error)=>{
        console.log("error occured while connecting to mongodb");
    })
}
export default connectToMongoDb;

export const getDb=()=>{
    if (!clients) {
        // Throw an error if the client is not connected
        throw new Error("Not connected to MongoDB");
    }
    return clients.db('test');
}