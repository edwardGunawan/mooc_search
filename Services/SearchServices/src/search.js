var {client,index,type} = require('./connection.js');
var search = async (options,offset=0,index=index) => {
  const response = await client.search({
    index,
    type,
    body:{
      from: offset, // allow return how many amount for pagination
      query:{
        bool:{
          // filter: filters(options),
          must:[
            {
              multi_match:{
                query:options,
                fields:['title^3','title.edge_ngram','description^1','description.edge_ngram^1','instructors.name','instructors.bio^1','language'],
                operator:'and',
                fuzziness:'2',
                type:'most_fields' // search for the combination of the score of all
              }
            }
          ]
        }
      },
      highlight:{fields:{description:{ }}}
    }
  });
  return response.hits.hits.map(searchHitResult);
}

function searchHitResult(hit) {
  return {
    title:hit._source.title,
    image:hit._source.image,
    link:hit._source.link,
    description:hit._source.description,
    currency:hit._source.currency_unit+hit._source.amount,
    instructors:hit._source.instructors,
    expected_duration:hit._source.expected_duration,
    start_date:hit._source.start_date,
    end_date: hit._source.end_date,
    language:hit._source.language,
    highlight:hit.highlight
  }
}

var filter = (options) =>{
  return {};
}

module.exports = search;
