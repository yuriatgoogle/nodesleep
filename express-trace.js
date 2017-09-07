/*
#    Copyright 2017 Google Inc.
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        https://www.apache.org/licenses/LICENSE-2.0

#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
*/

require('@google-cloud/trace-agent').start();

//for outbound HTTP
const options = {
    hostname: 'www.google.com',
    port: 80,
    path: '/',
    method: 'GET'
  };

const express = require('express');
const app = express();
const got = require('got');
const http = require('http');


// This incoming HTTP request should be captured by Trace
app.get('/', (req, res) => {

    
    //outbound HTTP request should be traced
    const myReq = http.request(options, (res) => {
        console.log("http requested" + res.url);
        console.log("STATUS: " + res.statusCode);
        });

        res.on('end', () => {
            console.log('http requested ' + res.url);
        });

        myReq.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
          });

    myReq.end();
    
    //return response
	res
        .status(200)
        .send("Thank you for using Stackdriver Trace!")
        //.send("I slept for " + sleepInt + " seconds before responding")
        .end();
    });

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running at http://127.0.0.1:8080/");
  console.log('Press Ctrl+C to quit.');
});