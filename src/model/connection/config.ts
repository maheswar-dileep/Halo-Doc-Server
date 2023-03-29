import mongoose, { createConnection } from 'mongoose'

const connection = () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/halo-doc');
        console.log("db connected successfully");
    } catch (error) {
        console.log(error);
    }
}




export default connection;
