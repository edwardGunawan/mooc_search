// Scrapping udemy courses

const cheerio = require('cheerio');
const request = require('request');
const URI = require('urijs');

var START_URL = 'https://arstechnica.com';
var SEARCH_WORD = 'amazon';
var MAX_PAGES_TO_VISIT = 10;


var url = new URI(START_URL);

var base_url = url.protocol() + '://' + url.hostname();

// visited page
var pageVisited = new Set();
var pageAlreadyVisited = new Map();
var pagesToVisit = [];
var numPagesVisited = 0;

pagesToVisit.push(START_URL);
crawl();

// crawl
// check if the number of pages is visited or not, if it is then crawl the next page
function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log('Reach max number of page visit');
    return;
  }


  var nextPage = pagesToVisit.pop();
  if(pageVisited.has(nextPage)) {
    // we have visited so repeat the crawl
    crawl();
  }else {
    // new page we haven't visited
    visitPage(nextPage, crawl);
  }

}

// check for URI
function checkLinks($) {
  // relative
  let relativeLinks = $('a[href^="/"]');
  // console.log(`relative links ${relativeLinks}`);
  // console.log(base_url);
  relativeLinks.each((i,link) => {
    var rel = link.attribs.href;
    // console.log(rel);
    // console.log(base_url);
    // console.log(base_url.concat(rel));
  });

  // absoluteLinks
  let absoluteLinks = $('a[href^="http"]');
  console.log(`${relativeLinks.length} found relativeLinks and ${absoluteLinks.length} found absoluteLinks`);
}


// visitPage
// request page
  // set the title and the link of that page to map
  // check status if it is true or not
  // extract all possible and find link to page
    // callback on crawl
function visitPage(url,callback) {
  // add page to pageVisited
  pageVisited.add(url);

  console.log(`Visiting page ${url}`);
  request(url,(err,res,body) => {
    console.log('Status code' , res.statusCode);
    if(res.statusCode !== 200) {
      callback(); // call on crawl if it cannot get in
      return;
    }
    let $ = cheerio.load(body);
    let isWordFound = searchForWord($, SEARCH_WORD);
    if(isWordFound) {
      // search for title of the page
      console.log(`Word ${SEARCH_WORD} is found at ${url}`);
      numPagesVisited++;
      pageAlreadyVisited.set(url, $('title').text());
      console.log(pageAlreadyVisited);

    }else {
      // checkLinks($);
      collectInternalLinks($);
      callback(); // call crawl again
    }

  });

}

// searchForWord
// search if word exist in that url
function searchForWord($,word) {
  let body = $('html > body').text().toLowerCase();
  let bodyTag = $('html > body').children();
  // console.log($('html > body').children().contents());


  // console.log(body);
  let bool = body.indexOf(word.toLowerCase());
  // let match = body.match('re');
  // console.log(match);
  // if(bool !== -1) console.log(body);
  console.log('the index of ' ,body.indexOf(word.toLowerCase()));

  return (body.indexOf(word.toLowerCase()) !== -1);
}


// Collect internal Link
// get relative_url, internally on a tag
// check if it is in the set or not
// getting relateive link 'a[href^=/]' start from
// getting absolute link a[href^=http]
function collectInternalLinks($) {
  var relativeLinks = $('a[href^="/"]');
  console.log(`Found ${relativeLinks.length} relativeLinks`);
  relativeLinks.each((i,link) => {
    var rel = link.attribs.href;
    pagesToVisit.push(base_url + rel);
  });
}
