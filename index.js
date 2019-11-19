//var dirPath = require("./images");
require('dotenv').config();
var dir = require('node-dir');
var FormData = require('form-data');
var request = require('request');
var axios = require('axios');

dir.readFiles(__dirname + "/images",
    function(err, content, next) {
      //  if (err) throw err;
     //   console.log('content:', content);
        getMLResponse(content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:', files);
    });

function getMLResponse(content){
    var options = {
        method: 'POST',
        url: 'https://innovator-challenge-cf.authentication.eu10.hana.ondemand.com/oauth/token',
        headers:
        {
          'content-type': 'application/x-www-form-urlencoded',
          authorization: 'Basic c2ItNDgzN2QxNmItN2Q3OC00ZDg4LTliOGMtMDMyMGNkZGYyMTc1IWIxMjQzOHxtbC1mb3VuZGF0aW9uLXhzdWFhLXN0ZCFiNTQwOlUyamhNRjh6Y3hjdHFCZkVTdnB0RVpaZ1oxbz0='
        },
        form: { grant_type: 'client_credentials' }
      };
    
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        else {
            let data = new FormData();
            data.append('file', content);
            data.append('modelName', 'Old_class4_retrainmodel1');
            data.append('modelVersion', '1');

          var json = JSON.parse(body);
          var options = {
            method: 'POST',
            url: 'https://mlfproduction-retrain-od-inference.cfapps.eu10.hana.ondemand.com/api/v2alpha1/image/object-detection/',
            headers:
            {
              'authorization': 'Bearer' + " " + json.access_token
            },
            body: data,
            json: true
          };
          axios.post(options.url, data, {
            headers: {
              'authorization': 'Bearer' + " " + json.access_token
            },
          }).then( function (response)
          {
            processMLResponse(response.body);
          }).catch(function (error)
          {
            console.log(error);
          });
          // request(options, function (error, response, body) {
          //   if (error) throw new Error(error);
          //   else
          //   {
          //       processMLResponse(response.body);
          //   }  
          
          // });
        }
});
} 

function proceesMLResponse(data){
  console.log(data);
}