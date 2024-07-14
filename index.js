const express=require('express');
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res)
{
    res.send("maja aa rha hai");
});

app.get('/profile',function(req,res)
{
    res.render("index");
});

app.listen(3500,function()
{
    console.log('its running');
})