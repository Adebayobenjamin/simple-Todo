const express = require('express');
const morgan = require('morgan');
const AuthRoutes = require('./router/authRoutes');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {requireAuth, CheckUser} = require('./middleware/authmiddleware');
const TodoRoutes = require('./router/todoRoutes');

const dbUri = "mongodb+srv://drell23:test1234@cluster0.slgfd.mongodb.net/Node-tuts?retryWrites=true&w=majority";

mongoose.connect(dbUri, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result=> console.log('connected to db')).catch(err=> console.log(err.message))

const app = express();

app.listen(4000, console.log("listening for requests on ports 4000"));

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
// routes
app.get('*', CheckUser)
app.get('/', (req,res)=>{
    res.redirect('/home')
})
app.get('/home', (req, res)=>{
    res.render('index')
});
app.use(AuthRoutes);
app.use(TodoRoutes);
app.use((req, res)=>{
    res.render('404');
})