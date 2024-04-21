var AWS = require('aws-sdk');


// Configura el SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Crear un nuevo objeto DynamoDB
var dynamodb = new AWS.DynamoDB();

function getChartData() {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
      };
  
      dynamodb.scan(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          var labels = [];
          var dataBitcoin = [];
          var dataEthereum = [];
  
          // Ordena los elementos por timestamp
          data.Items.sort((a, b) => a.timestamp.N - b.timestamp.N);

          data.Items.forEach(function(item) {
            labels.push(item.timestamp.N);
            dataBitcoin.push(item.precio_btc.N);
            dataEthereum.push(item.precio_eth.N);
          });

  
          resolve({
            labels: labels,
            dataBitcoin: dataBitcoin,
            dataEthereum: dataEthereum
          });
        }
      });
    });
  }
  
  module.exports = getChartData;