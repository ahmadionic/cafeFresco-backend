const mongoose = require('mongoose');
const dns = require('dns');
const { promisify } = require('util');

mongoose.set('strictPopulate', false);

const resolveSrv = promisify(dns.resolveSrv);

dns.setServers(['8.8.8.8', '1.1.1.1']);

const getDirectMongoURI = async (uri) => {
    if (!uri.includes('mongodb+srv://')) {
        return uri;
    }

    try {
        const parsed = new URL(uri);
        const srvHost = parsed.hostname;
        const records = await resolveSrv(`_mongodb._tcp.${srvHost}`);

        if (!records || records.length === 0) {
            return uri;
        }

        const hosts = records.map((record) => `${record.name}:${record.port}`).join(',');
        const dbName = parsed.pathname.replace(/^\//, '') || 'test';
        const username = encodeURIComponent(parsed.username);
        const password = encodeURIComponent(parsed.password);

        return `mongodb://${username}:${password}@${hosts}/${dbName}?retryWrites=true&w=majority&ssl=true&authSource=admin`;
    } catch (error) {
        console.warn('Could not build direct MongoDB URI:', error.message);
        return uri;
    }
};

const connectDB = async () => {
    const uri = process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cafefresco';

    if (!process.env.DB_URI && !process.env.MONGODB_URI) {
        console.warn('No DB_URI/MONGODB_URI provided; trying local MongoDB at mongodb://127.0.0.1:27017/cafefresco');
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            family: 4,
        });

        console.log('MongoDB connected...');
        return mongoose.connection;
    } catch (err) {
        if (uri.includes('mongodb+srv://')) {
            console.warn('SRV connection failed, trying direct Atlas hosts...');
            try {
                const directUri = await getDirectMongoURI(uri);
                await mongoose.connect(directUri, {
                    serverSelectionTimeoutMS: 15000,
                    socketTimeoutMS: 45000,
                    family: 4,
                });
                console.log('MongoDB connected with direct host fallback...');
                return mongoose.connection;
            } catch (fallbackErr) {
                console.error('Direct host fallback failed:', fallbackErr.message);
            }
        }

        console.error('Error connecting to MongoDB:', err.message);
        console.warn('Server will continue running, but database-backed routes will be unavailable until MongoDB is reachable.');
        return null;
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

module.exports = connectDB;
