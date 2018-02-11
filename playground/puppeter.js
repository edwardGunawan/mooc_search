/*
  http://books.toscrape.com/
*/
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const START_URL ='http://books.toscrape.com/';
const MAX_PAGE = 0;
let scrape = async function() {
  const browser = await puppeteer.launch({sloMo:250});
  const page = await browser.newPage();
  await page.goto(START_URL);

  await page.waitFor(1000);

  let content = await page.content();
  var $ = cheerio.load(content);
  var list = [];
  let i = 0;
  while(isNextPage($) && i < MAX_PAGE) {
    // console.log('Get through here');
    list.push(await getLiContent($));
    console.log(list);
    await clickNext(page);
    // cheerio needs to move again
    content = await page.content();
    $ = cheerio.load(content);
    i++;
  }

  return list;
  browser.close();


}

let getLiContent = async ($) => {
  console.log('Get into li content');
  // console.log($('#default > div > div > div > div > section > div:nth-child(2) ol').find('h3').text());
  let list = [];
  $('#default > div > div > div > div > section > div:nth-child(2) ol li').each((i,el) => {
      let title = $(el).find('h3').text();
      let rel_link = $(el).find('a').attr('href');
      let link = START_URL + rel_link
      let price = $(el).find('h3').next().children('.price_color').text();
      // console.log(price);
      let rel_img = $('img').attr('src');
      let img = START_URL + rel_img;
      list.push({title,link,img,price})
  });
  return list;
}

function isNextPage($) {
  let page = $('#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next').text().toLowerCase();
  console.log();
  return page.indexOf('next') !== -1;
}

let clickNext = async (page) =>{
  if(await page.$('#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next > a') !== null) {
    await page.click('#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next > a');
    await page.waitFor(1000);
  }

}

scrape().then((value) => {
  console.log(value);
},e => console.log(e));
