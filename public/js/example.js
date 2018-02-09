var request = require('request');

const udacity = 'https://www.udacity.com/public-api/v0/courses';
const edx = 'https://www.coursera.org/maestro/api/topic/list?full=1+or+https%3A%2F%2Fwww.coursera.org%2Fmaestro%2Fapi%2Ftopic%2Flist2';
var edxCoursesListing = {};
var udacityCourseListing = {};
request(coursera,(err,res,body) => {
  if(res.statusCode !== 200) {
    console.log('Response error');
  } else {
    console.log(body);
  }
})
