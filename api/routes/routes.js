'use strict';
module.exports = function(app) {
  var Travels = require('../models/models.js');
//for API
  app.route('/api/travels')
  .get(Travels.travels);

    app.route('/api/ships')
  .get(Travels.ships);
    };