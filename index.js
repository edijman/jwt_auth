const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const path = require('path');
var exphbs  = require('express-handlebars');
var cors = require('cors')
app.use(cors());

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import Routes
const authRoute = require('./routes/auth');
dotenv.config();

// connect to DB
mongoose.connect(process.env.DB_Connect, 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }, () => {
    console.log('connected to db')
})

app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs(
    {
        extname: '.hbs', 
        partialsDir: 'views/',
        defaultLayout: false
    }));
app.set('view engine', '.hbs');
// Middleware
app.use(express.json());
//Route Middlewares
app.use('/api/auth/', authRoute);

app.listen(4000, () => console.log('Server is running'));