var APIS = require('./get_course_content.js');
require('dotenv').config();
var fs = require('fs');
var currencyMap = require('../../data/currencymap.json');

const udemy_client_id = process.env.Udemy_API_CLIENT;
const udemy_client_pass = process.env.Udemy_API_SECRET_PASS;

var udemyAPI = new APIS.getUdemyAPI(udemy_client_id,udemy_client_pass);
var udacityAPI = new APIS.getUdacityAPI();
var iversityAPI = new APIS.getIversityAPI();



// json file structure
/*
  {
    title:
    image:
    link:
    description:
    price:
    instructors:
    expected_duration:
    level:
    start_date:
    end_date:
    language:
  }
*/
// var all_courses = [];
/* getting udacity API and process the data */
var course_udacity = async () => {
  return udacityAPI.getAPI().then((body) => {
    let courses_arr = JSON.parse(body).courses;
    // console.log(courses_arr);
    let i = 0;
    let all_courses = [];
    for(let course of courses_arr) {
      let instr_name = course.instructors.map(instr => instr.name);
      // console.log('instr_name ',instr_name );
      all_courses.push({
        id: `${i}_uda`,
        title:course.subtitle,
        image: course.image,
        link: course.homepage,
        description: `${(course.short_summary) ? course.short_summary : "no description"}`,
        price: '$199/month',
        instructors: instr_name,
        level: course.level
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
    let name = course.visible_instructors.map(instr => instr.display_name);
    // console.log(name);

      all_courses.push({
        id:`${i}_ude`,
        title: course.title,
        image: course.image_480x270,
        link: base_url + course.link,
        description:  `${(course.description) ? course.description: 'no description'}`,
        price:  course.price,
        instructors: name,
        expected_duration: `${(course.expected_ducation)?course.expected_ducation:0}`
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
        let instructor_name = course.instructors.map(instr => instr.name);
        // console.log('instructors',instructor_name);
        all_courses.push({
          id:`${courseCount}_iv`,
          title:course.title,
          image: course.image,
          link: course.url,
          description: `${(course.description)?course.description:"nodescription"}`,
          price: `${currencyMap.EUR.symbol} 300/month`,
          instructors: instructor_name,
          expected_duration: course.duration,
          level: course.knowledge_level,
          start_date: course.start_date,
          end_date: course.end_date,
          language: course.language
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
  fs.writeFile(__dirname + '/../../data/course.json', JSON.stringify(all_courses), (err) => {
    if(err) throw err;
    console.log('File is written!');
  });
}).catch(e => console.log(e.message));
