var {setup:{checkConnection, resetIndex,bulkImport}} = require('./connection.js');



try {
  checkConnection()
  .then(() => resetIndex())
  .then(() => bulkImport())
  .catch(e => console.error(`error message : ${e}`));
  // bulkImport().catch(e => console.error(e));

}catch(e){
  console.error(`cathch-error: ${e}`);
}
