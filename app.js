const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/category')
const reviewRoutes = require('./routes/review');
const cartRoutes = require('./routes/cart');
const wishRoutes = require('./routes/wishlist')
const paymentRoutes = require('./routes/payment')
const orderRoutes = require('./routes/order');
const recomendedRoutes = require('./routes/recomended');
const earningRoutes = require('./routes/dashboard')
const discount = require('./routes/discountCode')
const employee = require('./routes/employee')
const department = require('./routes/department')
const distributer = require('./routes/distributer')
const supplier = require('./routes/supplier');


require('dotenv').config();
const connectDB = require('./config/db');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const EventEmitter = require('events'); 
const cors = require('cors');


EventEmitter.defaultMaxListeners = 20;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3001',
    'https://cafe-fresco-dashboard.vercel.app',
    'https://cafe-fresco-main.vercel.app',
    'https://cafe-fresco-main-muhammaad-ismaeel-s-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(new Error('CORS Not Allowed'));
        }
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Route for user-related actions
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/category', categoryRoutes)
app.use('/product', productRoutes);
app.use('/review', reviewRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishRoutes);
app.use('/stripe', paymentRoutes)
app.use('/order', orderRoutes);
app.use('/user-Interest', recomendedRoutes);
app.use('/api', earningRoutes)
app.use('/discount', discount)
app.use('/employee', employee);
app.use('/department', department);
app.use('/supplier', supplier);
app.use('/distributer', distributer);


app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/health', (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? 'ok' : 'database-unavailable',
        database: dbConnected ? 'connected' : 'disconnected'
    });
});

const startServer = async () => {
    try {
        await connectDB();
        const listenOnPort = (port) => {
            const server = app.listen(port, HOST, () => {
                console.log(`Server running on http://${HOST}:${port}`);
            });

            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.warn(`Port ${port} is busy, trying ${port + 1}...`);
                    server.close(() => listenOnPort(port + 1));
                } else {
                    console.error('Failed to start server:', error.message);
                    process.exit(1);
                }
            });
        };

        listenOnPort(PORT);
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
