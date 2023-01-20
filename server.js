const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname + '/404.html');
});

app.use('/', router);

app.listen(3000, function(){
  console.log("App server is running on port 3000");
  console.log("to end press Ctrl + C");
});