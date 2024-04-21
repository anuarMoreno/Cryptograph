var express = require('express');
var cors = require('cors');
var getChartData = require('../public/scripts/apiRequest');
var path = require('path');
var app = express();

app.use(cors());

// Sirve los archivos estáticos de tu aplicación front-end
app.use(express.static(path.join(__dirname, '../public')));

app.get('/chart-data', function(req, res) {
  getChartData().then(data => {
    console.log(data); // Imprime los datos
    res.json(data);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(80, () => {
  console.log('App is listening on port 80');
});