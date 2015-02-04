module.exports = function(app) {
  var express = require('express');
  var assetsRouter = express.Router();
  var fs = require('fs');

  var ASSETS_PATH = './public/assets';

  function isImageFile(filename) {
    return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(filename);
  }

  var uid = 0;
  function formatData(asset) {
    return {
      id: (uid++),
      path: '/assets/' + asset
    };
  }

  assetsRouter.get('/', function(req, res) {
    fs.readdir(ASSETS_PATH, function(err, files) {
      if (err) throw err;

      var assets = files.filter(isImageFile).map(formatData);

      res.send({
        'assets': assets
      });
    });
  });
  app.use('/api/assets', assetsRouter);
};
