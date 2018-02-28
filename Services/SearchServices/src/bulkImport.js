var {index, jsonFile, setup:{checkConnection, resetIndex,bulkImport}} = require('./connection.js');



try {
  checkConnection()
  .then(() => resetIndex(index))
  .then(() => bulkImport(jsonFile,index))
  .catch(e => console.error(`error message : ${e}`));
  // bulkImport().catch(e => console.error(e));

}catch(e){
  console.error(`cathch-error: ${e}`);
}
