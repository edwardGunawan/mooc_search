module.exports = {
  number_of_shards: 1,
  analysis:{
    filter: {
      autocomplete_filter:{
        type:'edge_ngram',
        min_gram:3,
        max_gram:20
      }
    },
    analyzer:{
      // the main purpose is to do partial matching on the given query string
      // for autocomplete
      autocomplete_analyzer:{
        type:'custom',
        tokenizer:'standard',
        filter:[
          'lowercase',  // convert all token to lowercase
          'autocomplete_filter',
          // 'asciifolding' // that converts non ASCII characters into there equivalent 127 ASCII characters like Café Society into Cafe Society etc
        ]
      }
    }
  }
}
