'user strict';
var neo4j = require('neo4j-driver');
//console.log(neo4j);
var driver = neo4j.v1.driver("bolt://100.25.141.15:33414", neo4j.v1.auth.basic("neo4j", "set-policy-instruments"),{encrypted: true});
driver.onCompleted = () => {
    console.log('Driver created');
  };
  
  driver.onError = error => {
    console.log(error);
  };

module.exports = driver;
