import { connect} from 'mongoose';

const connectToMongo = async()=>{
    try{
        await connect("mongodb://localhost:27017" , {
            dbName: "PaymentGateWay"
        })
        console.log("Connected to MongoDB successfully")

    }catch(error){
        console.log(error)
    }
}

export default connectToMongo;