module.exports = {
  properties:{
    title_tag:{
      type:'text'
    },
    title: {
      type: 'text',
      analyzer:'standard', // analyze standard
      // problem finding regarding relevancy with n_edgegram
      // set edge_ngram field to so when querying it
      // set query for both field and combine the score to create
      // better relevancy
      fields:{
        edge_ngram: { // edge_ngram
          type: 'text',
          analyzer:'autocomplete_analyzer',
          search_analyzer:'standard'
        },
        completion: { // suggester completion
          type:'completion',
          analyzer:'standard'
        }
      }
    },
    image: {
      type:'text'
    },
    link: {
      type:'text'
    },
    description: {
      type:'text',
      analyzer:'standard',
      fields: {
        edge_ngram: {
          type:'text',
          analyzer:'autocomplete_analyzer',
          search_analyzer:'standard'
        }
      }
    },
    currency_unit: {
      type:'text'
    },
    amount: {
      type:'text'
    },
    instructors : {
      type:'nested',
      properties : {
        name: {
          type: 'text',
          analyzer:'autocomplete_analyzer',
          search_analyzer:'standard'
        },
        bio: {
          type:'text',
          analyzer:'autocomplete_analyzer',
          search_analyzer:'standard'
        },
        image: {
          type: 'text'
        }
      }
    },
    level : {
      type:'keyword'
    },
    expected_duration: {
      type:'text'
    },
    start_date: {
      type:'date'
      // format:'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis',
      // ignore_malformed:true
    },
    end_date:{
      type:'date'
      // format:'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis',
      // ignore_malformed: true
    },
    language: {
      type:'text'
    }
    // suggest:{ // when needed to construct completion suggestion on a specific field on all mapping
    //   type: 'completion',
    //   analyzer:'autocomplete_analyzer', // index will be n_edgegram
    //   search_analyzer:'autocomplete_analyzer', // put search will be standard so user will get the result
    //   preserve_position_increments: false,
    //   preserve_separators: false // getting rid of stopwords
    //
    // }
  }
}
