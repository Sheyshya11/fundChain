const express=require('express')
const routes=require('./route')
const ejs =require('ejs')
const cors=require('cors')
const app= express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())

app.use(routes)

app.listen(5000,()=>{
    console.log('server started on port 5000');
})