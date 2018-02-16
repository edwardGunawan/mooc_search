var {setup:{resetIndex,bulkImport}} = require('./connection.js');



try {
  resetIndex().then(() => {
    bulkImport();
  }).catch(e => console.error(`error message : ${e}`));

}catch(e){
  console.error(`cathch-error: ${e}`);
}
