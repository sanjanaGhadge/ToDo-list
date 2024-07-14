const fs = require('fs');
fs.writeFile("hey.txt","how are you",function(err){
    if(err) throw err;
    else console.log("done");
})

const express = require('express')
const app = express()

app.use(function(req,res,next)
{
  console.log('middleware running');
   next();
});

app.get('/', function (req, res) {
  res.send('Hello World , my name is sanjana , i love dog-name is shobby');
});

app.get('/profile', function (req, res,next) {
  res.send('i live in pune');
});

/*app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})*/

app.listen(3000);