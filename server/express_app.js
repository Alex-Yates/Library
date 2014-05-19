var express = require('express');
var compress = require('compression');

module.exports = function() {
  var fragmented = function (root) {
    return function (req, res, next) {
      var esc = req.query._escaped_fragment_;
      if (esc) {
        var relPath = esc.replace('#!', '').slice(1).replace(/\//g, '_') + ".gen.html";
        res.sendfile(relPath, {root: root + '/generated' });
      } else {
        next();
      }
    };
  };

  var port = process.env.PORT || 4000;
  var pub = process.env.PUBLIC || './public';

  var app = express();

  app.use(compress());

  app.use(fragmented(pub));

  app.get('/', function (req, res) {
    res.sendfile(pub + '/index.html');
  });

  var oneDay = 86400000;
  app.use(express.static(pub, { maxAge: oneDay }));

  return app.listen(port);
};
