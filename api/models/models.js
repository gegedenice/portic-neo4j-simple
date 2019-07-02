'user strict';
var driver = require('./db.js');

exports.travels = function (req, res) {
var travels = [];
    //var unicas = [];
    var session = driver.session();
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
   .run("MATCH (p1:Port)-[g:GO_TO]->(p2:Port) RETURN p1,g,p2 LIMIT 50")
  .subscribe({
        onNext: function (record) {
            travels.push(record)
        },
        onCompleted: function () {
            // Completed!
            session.close();
            res.send(travels);
        },
        onError: function (error) {
            console.log(error);
        }
    });
  };

  exports.ships = function (req, res) {
    var ships = [];
        //var unicas = [];
        var session = driver.session();
        // Run a Cypher statement, reading the result in a streaming manner as records arrive:
        session
       .run("match (n)-[r]->(m) return distinct(r.ship),count(r.ship) order BY count(r.ship) DESC")
      .subscribe({
            onNext: function (record) {
                ships.push({name:record._fields[0],count:record._fields[1].low})
            },
            onCompleted: function () {
                // Completed!
                session.close();
                res.send(ships);
            },
            onError: function (error) {
                console.log(error);
            }
        });
      };