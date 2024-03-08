var express = require('express');
var router = express.Router();

let donorsList = [
  { id: 1, name: 'Manohar', email_id: 'yrl@gmail.com', phone_no: '31487977656',address: '231 N Vandeventer St Louis, MO'},
  { id: 2, name: 'john' ,email_id: 'john@gmail.com', phone_no: '3147678999',address: '32 WestEnd Terrace Appartments, St. Louis, MO'}
]; 


router.get('/', function(req, res, next) {
  res.json(donorsList);
});


module.exports = router;