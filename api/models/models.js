'user strict';
var driver = require('./db.js');
//Juste pour tester
exports.travels = function (req, res) {
var travels = [];
    var session = driver.session();
    session
   .run("MATCH (p1:Port)-[g:GO_TO]->(p2:Port) RETURN p1,g,p2 LIMIT 50")
  .subscribe({
        onNext: function (record) {
            travels.push(record)
        },
        onCompleted: function () {
            session.close();
            res.send(travels);
        },
        onError: function (error) {
            console.log(error);
        }
    });
  };
//pour api ships
  exports.ships = function (req, res) {
    var ships = [];
        var session = driver.session();
        session
       .run("match (n)-[r]->(m) return distinct(r.ship),count(r.ship) order BY count(r.ship) DESC")
      .subscribe({
            onNext: function (record) {
                ships.push({name:record._fields[0],count:record._fields[1].low})
            },
            onCompleted: function () {
                session.close();
                res.send(ships);
            },
            onError: function (error) {
                console.log(error);
            }
        });
      };