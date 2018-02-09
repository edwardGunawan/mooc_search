const Sequelize = require('sequelize');
var env = Process.env.NODE_ENV || 'development';
var sequelize;

if(env === 'development') {
  sequelize = new Sequelize(undefined, undefined ,undefined, {
    host: 'localhost',
    dialect:'sqlite',
    storage:'__dirname/../data/dev-course-listing.sqlite'
  });
}else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:'postgres'
  });
}

var db = {};

db.courses = sequelize.import(__dirname + '/models/courses.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
