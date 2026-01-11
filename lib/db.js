import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

async function dbConnect() {
    if(mongoose.connection.readyState === 1) {
        console.log('mongodb already connected')
    }


    try {
        await mongoose.connect(MONGODB_URL)
    } catch (error) {
        console.error("failed to connect to mongodb")
        throw error
    }

}

export default dbConnect