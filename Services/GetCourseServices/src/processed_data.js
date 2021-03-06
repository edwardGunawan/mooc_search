var APIS = require('./get_course_content.js');
require('dotenv').config({path:__dirname+'/../.env'});
var fs = require('fs');
var currencyMap = require('../data/currencymap.json');
var striptags = require('striptags');
var sw = require('stopword');

const udemy_client_id = process.env.Udemy_API_CLIENT;
const udemy_client_pass = process.env.Udemy_API_SECRET_PASS;

var udemyAPI = new APIS.getUdemyAPI(udemy_client_id,udemy_client_pass);
var udacityAPI = new APIS.getUdacityAPI();
var iversityAPI = new APIS.getIversityAPI();



// json file structure
/*
  {
    id:'string'
    title: 'string'
    image: 'string'
    link: 'string'
    description: 'string'
    price: {
      currency-unit: 'string'
      amount: double
    }
    instructors:[
      {
        name: 'string'
        bio: 'string'
        image: 'string'
      }
    ]
    expected_duration: 'string'
    level: 'string'
    start_date: 'double'
    end_date: 'double'
    language: 'string',
    title_tag:['string']
  }
*/
var map_language = {
  'Modern Standard Arabic': 'ar',
  'Bengali':'bn',
  'Brazilian Portuguese':'br',
  'Danish':'da',
  'German':'de',
  'English':'en',
  'Spanish':'es',
  'Farsi':'fa',
  'French':'fr',
  'Hindi':'hi',
  'Italian':'it',
  'Japanese':'ja',
  'Dutch':'nl',
  'Norwegian':'no',
  'Polish':'pl',
  'Portuguese':'pt',
  'Russian':'ru',
  'Swedish':'sv',
  'Chinese Simplified':'zh'

}

/*
  Removing Stopword in the title and put it as a title_tag in one of the field
  for completion-suggester
*/
var getTitleTag = (title, language='English') => {
  const old_title = title.toLowerCase().split(' ');
  return sw.removeStopwords(old_title,sw[map_language[language]]).filter((x) => (x !== (undefined || null || '')));

}
// var all_courses = [];
/* getting udacity API and process the data */
var course_udacity = async () => {
  return udacityAPI.getAPI().then((body) => {
    let courses_arr = JSON.parse(body).courses;
    // console.log(courses_arr);
    let i = 0;
    let all_courses = [];
    for(let course of courses_arr) {
      let instructor_arr = course.instructors.map(instr => {
        return {
          name :instr.name,
          bio: instr.bio,
          image:instr.image
        }
      });
      // console.log('instr_name ',instr_name );
      all_courses.push({
        // id: `${i}_uda`,
        title:course.title || course.subtitle,
        image: course.image,
        link: course.homepage,
        description: `${(course.short_summary) ? course.short_summary : "no description"}`,
        currency_unit: '$',
        amount:'0',
        instructors: instructor_arr,
        level: course.level,
        expected_duration:`${course.expected_duration} ${course.expected_duration_unit}`,
        start_date:0,
        end_date:0,
        language:'English'
        // title_tag: getTitleTag(course.title || course.subtitle)
      });
      i++;
    }
    console.log(`${i} amount of courses in Udacity is written.`);
    // stringfy json
    return JSON.stringify(all_courses);
  }).catch(e => console.log('err',e));
}

/* Getting Udemy Courses */
var course_udemy = async() =>{
  return udemyAPI.get_course_list({
    page_size: 100,
    page: 10,
    path:'/api-2.0/courses',
    category:'Development',
    ordering:'relevance',
    language: 'en'
  }).then((course_arr) => {
    let all_courses= [];
    let base_url = 'https://www.udemy.com';
    let i = 0;

    for(course of course_arr) {
    let name = course.visible_instructors.map(instr => {
      return {
        name: instr.display_name,
        image: instr.image_100x100,
        bio: instr.job_title
      }
    });
    // console.log(base_url+course.url);

      all_courses.push({
        // id:`${i}_ude`,
        title: course.title,
        image: course.image_480x270,
        link: base_url + course.url,
        description:  `${(course.description) ? course.description: 'Click on website to know more'}`,
        currency_unit: course.price.charAt(0),
        amount:course.price.substring(1),
        instructors: name,
        expected_duration: `${(course.expected_ducation)?course.expected_ducation:0}`,
        start_date:0,
        end_date:0,
        language:'English'
        // title_tag: getTitleTag(course.title)
      });
      i++;
    }
    console.log(`${i} amount of courses in Udemy is written`);
    return JSON.stringify(all_courses);
  }).catch(e => console.log(e));
}

/*
 Getting Iversity Courses
*/
var course_iversity = async() => {
    return iversityAPI.getAPI().then((bodyJson) => {
      let bodyObj = JSON.parse(bodyJson);

      let courseCount = 0;
      let all_courses = [];
      bodyObj.courses.forEach((course) => {
        // get all instructors name
        let instructor_arr = course.instructors.map(instr => {
          return {
            name:instr.name,
            bio:`${striptags(instr.biography)}`,
            image:instr.image
          }
        });
        // console.log('instructors',instructor_name);
        all_courses.push({
          // id:`${courseCount}_iv`,
          title:course.title,
          image: course.image,
          link: course.url,
          description: `${(course.description)?striptags(course.description):"nodescription"}`,
          currency_unit: `${currencyMap.EUR.symbol_native}`,
          amount:'300/month',
          instructors: instructor_arr,
          expected_duration: course.duration,
          level: course.knowledge_level,
          start_date: course.start_date,
          end_date: course.end_date,
          language: course.language
          // title_tag: getTitleTag(course.title, course.language)
        });
        courseCount++;
      });
    console.log(`${courseCount} amount of courses in Iversity was written.`);
    return JSON.stringify(all_courses);
  }).catch(e => console.log(e));
}

// async function fetch_parallel() {
//   const udacity = course_udacity();
//   const udemy = course_udemy();
//   const iversity = course_iverstiy();
//   // this will wait until all of the function executes
//   return [
//     await udacity,
//     await udemy,
//     await iversity
//   ]
// }

/* run all courses paralllely */
Promise.all([course_udacity(),course_udemy(),course_iversity()]).then(([udacity,udemy,iversity]) => {
  let udacity_obj = JSON.parse(udacity);
  let udemy_obj = JSON.parse(udemy);
  let iversity_obj = JSON.parse(iversity);
  let all_courses = [...udacity_obj,...udemy_obj,...iversity_obj]; // combine all array of objects courses into 1 array object courses
  fs.writeFile(__dirname + '/../data/course.json', JSON.stringify(all_courses), (err) => {
    if(err) throw err;
    console.log('File is written!');
  });
}).catch(e => console.log(e.message));
