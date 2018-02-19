var {client,index,type} = require('./connection.js');

var getSuggest = async (searchTerm) => {
  const response = await client.search({
    index,
    body: {
      suggest:{
        search_suggest:{ // name of the search_suggest
          prefix:searchTerm,
          completion:{ // type of suggestions
            field: 'title.completion', // Name of the field to search for suggestion
            size: 5, // number of suggestions to return
            skip_duplicates: true, // filter out doc with duplicates suggestions from the result
            fuzzy: {
              fuzziness:1 // set fuzziness to 2
            }

          }
        }
      }
    }
  });

  return response.suggest.search_suggest[0].options.map((option) => {
    return option._source.title; // get all the titles on all the options
  })

}

module.exports = getSuggest;
