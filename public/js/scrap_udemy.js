const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const START_URL ='https://www.udemy.com/courses/development/all-courses';
const MAX_PAGE = 5;
let scrape = async function() {
  const browser = await puppeteer.launch({headless:false,sloMo:250});
  const page = await browser.newPage();
  await page.goto(START_URL);

  await page.waitFor(1000);

  let content = await page.content();
  var $ = cheerio.load(content);
  var list = [];
  let i = 0;
  // list.push(await getLiContent($));
  // console.log(isNextPage($));
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
  $('#udemy > div.main-content-wrapper > div.main-content > ui-view > ui-view > div.p_channel.channels.skin6.channel-featured > div.tab-content > div > div > ul.card-wrapper li').each((i,el) => {
      let title = $(el).find('h1').text();
      let rel_link = $(el).find('.search-course-card--card--left-col--3kKip').children('a').attr('href');
      // console.log(rel_link);
      // #udemy > div.main-content-wrapper > div.main-content > ui-view > ui-view > div.p_channel.channels.skin6.channel-featured > div.tab-content > div > div > ul.card-wrapper > li:nth-child(1) > search-course-card-container > div > div > div.search-course-card--card--left-col--3kKip > a
      let link = START_URL + rel_link
      let price = $(el).find('.search-course-card--card__price-wrapper--HKgH3').text();
      // console.log(price);
      let img = $('img').attr('src');
      list.push({title,link,img,price})
  });
  return list;
}

function isNextPage($) {
  let page = $('#udemy > div.main-content-wrapper > div.main-content > ui-view > ui-view > div.p_channel.channels.skin6.channel-featured > div.tab-content > div > div > ul.pagination.fx-c.mt20.mb60 > li:nth-child(7)').children('a').html();
  console.log(page);
  return page.indexOf('next') !== -1;
}

let clickNext = async (page) =>{
  if(await page.$('#udemy > div.main-content-wrapper > div.main-content > ui-view > ui-view > div.p_channel.channels.skin6.channel-featured > div.tab-content > div > div > ul.pagination.fx-c.mt20.mb60 > li:nth-child(7) > a') !== null) {
    await page.click('#udemy > div.main-content-wrapper > div.main-content > ui-view > ui-view > div.p_channel.channels.skin6.channel-featured > div.tab-content > div > div > ul.pagination.fx-c.mt20.mb60 > li:nth-child(7) > a');
    await page.waitFor(1000);
  }

}

scrape().then((value) => {
  console.log(value);
},e => console.log(e));
