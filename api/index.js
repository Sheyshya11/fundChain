const express=require('express')
const routes=require('./route')
const path= require('path')
const corsOptions= require('./config/corsOptions')
const ejs =require('ejs')
const cors=require('cors')
const { v4 } = require('uuid'); 
const app= express();
/* app.use(cors({
  origin: '*'
})) */
app.use(cors(corsOptions))
app.set("view engine", "ejs");
app.set('views',path.join(__dirname,'views'))
app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({extended: false}));
app.use(express.json());



app.use(routes)



app.listen(5000,(req,res)=>{
  console.log("Server is running on 5000 port")
})