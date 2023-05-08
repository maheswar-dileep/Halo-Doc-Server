import mongoose from 'mongoose';

const connection = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log('db connected successfully');
  } catch (error) {
    console.log(error);
  }
};

export default connection;
