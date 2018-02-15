module.exports = {
  properties:{
    title: {
      type: 'text',
      analyzer:'standard', // analyze standard
      // problem finding regarding relevancy with n_edgegram
      // set edge_ngram field to so when querying it
      // set query for both field and combine the score to create
      // better relevancy
      fields:{
        edge_ngram: {
          type: 'text',
          analyzer:'autocomplete_analyzer',
          search_analyzer:'standard'
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
      analyzer:'autocomplete_analyzer',
      search_analyzer:'standard',

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
      type:'keyword'
    },
    end_date:{
      type:'keyword'
    },
    language: {
      type:'text'
    }
  }
}
