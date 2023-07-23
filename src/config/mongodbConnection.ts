import mongoose from 'mongoose';

mongoose.connection.once('connected', () => {
  console.log('db connected successfully');
});

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
  }
};

export default connection;
