// Getting all courses
// userfule read on async: https://stackoverflow.com/questions/35302431/async-await-implicitly-returns-promise
var rp = require('request-promise');
var base64 = require('js-base64').Base64;

class getUdemyAPI {
  constructor(clientId,clientPass) {
    this.clientId = clientId;
    this.clientPass = clientPass;
    this.base_url = 'https://www.udemy.com';
  }

  async getAPI (path) {
    let options = {
      url: this.base_url + path,
      'auth' : {
        'user' : this.clientId,
        'pass' : this.clientPass,
        'sendImmediately' : true
      },
      'headers' : {
        'Authorization' : 'Basic ' + base64.encode(`${this.clientId}:${this.clientPass}`)
      }
    }

    return rp(options);
  }

  // get all page json file and return the json string array
  async get_course_list({page_size,page,path,...rest}) {
    let json_arr = [];
    let url = path +'?';

    // loop through rest of object to parse the url
    for(let key in rest){
      // console.log(rest[key]);
      url += `${key}=${rest[key]}&`;
    }

    for(let i = 1; i<=page; i++) {
      let page_url = url + `page=${i}&page_size=${(page_size*i < 10000) ? page_size : (10000/i-23)}`; // get the page url

      await this.getAPI(page_url).then((json_data) => {
        console.log(page_url);
        // console.log(json_data);

        // console.log(JSON.parse(json_data));
        let result_arr = JSON.parse(json_data).results;
        json_arr.push(...result_arr); // putting all courses to a single array
      }).catch(e => console.log('in get_course_content',e.message));
    }
    return json_arr;

  }
}

class getUdacityAPI {
  constructor() {
    this.url = 'https://www.udacity.com/public-api/v0/courses';
  }
  // call callback to process further
  async getAPI() {
    return rp(this.url);
  }
}

class getKhanAcademyAPI {
  constructor() {
    this.url = 'http://www.khanacademy.org/api/v1/topictree';
  }

  async getAPI() {
    return rp(this.url);
  }
}

class getIversityAPI {
  constructor() {
    this.url = 'http://iversity.org/api/v1/courses';
  }
  async getAPI() {
    return rp(this.url);
  }
}

module.exports = {
  getUdemyAPI,
  getUdacityAPI,
  getKhanAcademyAPI,
  getIversityAPI
};
