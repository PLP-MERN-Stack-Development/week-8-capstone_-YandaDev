import mongoose from "mongoose";

const connectDB = async() => {
    try {
        // Use environment-specific MongoDB URI
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/techjobhub_dev';
        
        await mongoose.connect(mongoURI, {
            // Connection options for better reliability
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        
        const isLocal = mongoURI.includes('localhost') || mongoURI.includes('127.0.0.1');
        console.log(`MongoDB connected successfully to ${isLocal ? 'LOCAL' : 'ATLAS'} database`);
        console.log(`Database: ${mongoose.connection.name}`);
        
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Exit process with failure
        process.exit(1);
    }
}

export default connectDB;