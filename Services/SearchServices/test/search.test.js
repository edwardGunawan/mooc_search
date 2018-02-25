/*----------------------------
  Testing search
------------------------------ */
var search = require('./search.js');


search({input: 'java'},0).then(response => {
  console.log(response);
}).catch(e => console.log(e.message));


search({input:'jva'},0).then(response => {
  console.log(response);
}).catch(e => console.log(e.message));
