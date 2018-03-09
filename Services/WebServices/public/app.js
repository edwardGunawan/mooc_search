// https://jsfiddle.net/yyx990803/xgrjzsup/

// searchbar components
const SearchBar = Vue.component('search-bar', {
  template:`
    <input type="text" v-model="searchTerm" v-on:keyup="onSearchInput()" placeholder="Java">
  `,
  props:['searchTerm'],
  methods: {
    onSearchInput () {
      this.$parent.handleSearchInput(this.searchTerm)
    }
  }
});


// Submit Button (triggered Search)
const Submit = Vue.component('submit', {
  template:`
    <button type="button" name="Submit" v-on:click="onSearch()">Submit</button>
  `,
  methods: {
    onSearch() {
      this.$parent.handleSearch();
    }
  }
})

// FrontPageContainer
const FrontPageContainer = Vue.component('front-page-container',{
  // need to defined the template like in react
  template: `
    <div>
      <label class="label hero-title">Mooc_Search</label>
      <search-bar :searchTerm="searchTerm" :onSearchInput="handleSearchInput"></search-bar>
      <submit :onSearch="handleSearch"></submit>
      {{ autoCompleteResult }}
    </div>`,
  data() {
    return {
      searchTerm:'',
      searchOffset:0,
      baseUrl: 'http://localhost:3000',
      searchDebounce: null,
      searchResult: [],
      autoCompleteResult: []
    }
  },
  methods: {
    // no arrow function
    // debounce search input by 100ms
    handleSearchInput (searchTerm) {
      this.searchTerm = searchTerm;
      clearTimeout(this.searchDeboucne);
      this.searchDebounce = setTimeout(async () => {
        this.searchOffset = 0;
        this.searchResult = await this.onSuggest(this.searchTerm);
      },100);
    },

    async onSuggest (term = '') {
      try {
        let response = await axios({
          method: 'get',
          url:`${this.baseUrl}/suggest`,
          params: {
            q: term
          }
        });
        this.autoCompleteResult = response.data;
        console.log('in parent autoCompleteResult', this.autoCompleteResult);

      }catch (e) {
        console.error(e);
      }
    },

    async handleSearch() {
      if(this.searchTerm.length !== 0) {
        try {
          // console.log(`${this.$router}`);
          // let response = await axios({
          //   method: 'get',
          //   url: `${this.baseUrl}/search`,
          //   params: {
          //     q: this.searchTerm
          //   }
          // });
          // this.searchResult = response.data;
          console.log('here in front page component');
          // push router to /search
          this.$router.push({path:'/search', query:{q:this.searchTerm }});
          // console.log(this.searchResult);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
});



const SearchContainer = Vue.component('search-container',{
  template:`
  <div>
    <h1> Welcome to Search Template </h1>
    <p> search term is {{ $route.query.q }}</p>
    <search-bar :searchTerm="searchTerm" :onSearchInput="handleSearchInput"></search-bar>
    <submit :onSearch="handleSearch"></submit>
    <ul>
      <li v-for="res in searchResult">
        <a :href="res.link" target="_blank">{{ res.title }}</a>
        <p> {{ res.currency }} </p>
        <p> {{ res.description }} </p>
        <img :src="res.image" :alt="res.title"/>
      </li>
    </ul>
  </div>
  `,
  data() {
    return {
      searchTerm:'',
      searchOffset:0,
      baseUrl: 'http://localhost:3000',
      searchDebounce: null,
      searchResult: [],
      autoCompleteResult: []
    }
  },
  created () {
    this.searchTerm = this.$route.query.q;
    this.handleSearch();
  },
  methods: {
    // no arrow function
    // debounce search input by 100ms
    handleSearchInput (searchTerm) {
      this.searchTerm = searchTerm;
      clearTimeout(this.searchDeboucne);
      this.searchDebounce = setTimeout(async () => {
        this.searchOffset = 0;
        this.searchResult = await this.onSuggest(this.searchTerm);
      },100);
    },

    async onSuggest (term = '') {
      try {
        let response = await axios({
          method: 'get',
          url:`${this.baseUrl}/suggest`,
          params: {
            q: term
          }
        });
        this.autoCompleteResult = response.data;
        console.log('in parent autoCompleteResult', this.autoCompleteResult);

      }catch (e) {
        console.error(e);
      }
    },

    async handleSearch() {
      if(this.searchTerm.length !== 0) {
        try {
          // console.log(`${this.$router.query}`);
          console.log(`This is the searchTerm ${this.searchTerm}`);
          let response = await axios({
            method: 'get',
            url: `${this.baseUrl}/search`,
            params: {
              q: this.searchTerm
            }
          });
          this.searchResult = response.data;
          console.log('here in searchContainer component',this.searchResult);
          // push router to /search
          this.$router.push({path:'/search', query:{q:this.searchTerm }});
          // console.log(this.searchResult);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
});


// creating routes
const routes = [
  { path:'/', component: FrontPageContainer },
  { path:'/search', component: SearchContainer }
];

const router = new VueRouter({
  routes
});

// create and mount the root instance
const app = new Vue({
  router
}).$mount('#app');
