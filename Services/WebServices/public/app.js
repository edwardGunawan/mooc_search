// https://jsfiddle.net/yyx990803/xgrjzsup/

// Global variable
Vue.use(Buefy.default)
// <section>
//   <b-autocomplete
//             rounded
//             v-model="searchTerm"
//             :data="filteredDataArray"
//             placeholder="e.g. jQuery"
//             icon="magnify"
//             @select="option => selected = option">
//             <template slot="empty">No results found</template>
//   </b-autocomplete>
// </section>
// <input type="text" v-model="searchTerm" v-on:keyup="onSearchInput()" placeholder="Java">
//   here {{ autoCompleteResult }}
// </div>


// searchbar components
// keyup.enter.native to get the eventhandler to work on autocomplete
const SearchBar = Vue.component('search-bar', {
  template:`
  <section class="search-bar">
    <b-autocomplete
              rounded
              v-model="searchTerm"
              :data="autoCompleteResult"
              :loading="isFetching"
              placeholder="e.g. jQuery"
              icon="magnify"
              @input="onSearchInput"
              @keyup.enter.native="onSearch()"
              @select="option => selected = option">
              <template slot="empty">No results found</template>
    </b-autocomplete>
  </section>
  `,
  props:['searchTerm','setSearchTerm','baseUrl','handleSuggest','onSearch'],
  data () {
    return {
      autoCompleteResult: [],
      isFetching:false,
      searchDebounce: null,
      selected: null
    }
  },
  watch: {
    // click on term to go to submit
    selected (newTerm, oldTerm) {
      console.log(`${newTerm} new Term and old term ${oldTerm}`);
      this.setSearchTerm(newTerm);
      this.onSearch();
    }
  },
  methods: {
    // no arrow function
    // debounce search input by 100ms
    async onSearchInput () {
      clearTimeout(this.searchDeboucne);
      this.searchDebounce = setTimeout(async () => {
        this.searchOffset = 0;
        return this.onSuggest(this.searchTerm);
      },100);
    },

    async onSuggest (term = '') {
      try {
        isFetching = true;
        this.autoCompleteResult = await this.handleSuggest(term);
        isFetching = false;
      }catch (e) {
        isFetching = false;
        console.error(e);
      }
    }
  }
});


// Submit Button (triggered Search)
const Submit = Vue.component('submit', {
  // template:`
  //   <button type="button" class="button is-light is-medium" name="Submit" v-on:click="onSearch()">Submit</button>
  // `,
  props:['onSearch']
});

// FrontPageContainer
const FrontPageContainer = Vue.component('front-page-container',{
  // need to defined the template like in react
  template: `
    <div class="container is-fluid front-page">
      <label class="label hero-title">Mooc_Search</label>
      <search-bar :searchTerm="searchTerm" :setSearchTerm="setSearchTerm" :baseUrl="baseUrl" :handleSuggest="handleSuggest" :onSearch="handleSearch"></search-bar>
      <submit :onSearch="handleSearch" :searchTerm="searchTerm" ></submit>
    </div>`,
  data() {
    return {
      searchTerm:'',
      selected: null, // select the term
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
    // async handleSearchInput (searchTerm) {
    //   this.searchTerm = searchTerm;
    //   clearTimeout(this.searchDeboucne);
    //   this.searchDebounce = setTimeout(async () => {
    //     this.searchOffset = 0;
    //     return this.onSuggest(this.searchTerm);
    //   },100);
    // },
    async setSearchTerm(term = ''){
      this.searchTerm = term;
    },
    async handleSuggest (term = '') {
      try {
        console.log(`in handleSuggest ${term}`);
        this.searchTerm = term;
        console.log(`searchTerm ${this.searchTerm}`);
        let response = await axios({
          method: 'get',
          url:`${this.baseUrl}/suggest`,
          params: {
            q: term
          }
        });
        return response.data;
        // console.log('in parent autoCompleteResult', this.autoCompleteResult);
      }catch (e) {
        console.error(e);
      }
    },

    async handleSearch() {
      console.log(`in handle search ${this.searchTerm} and len ${this.searchTerm.length}`);
      if(this.searchTerm.length !== 0) {
        try {
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
    <nav class="columns">
      <div class="column is-1 is-one-third-mobile">
        <label class="label hero-subtitle">Mooc_Search</label>
      </div>
      <div class="column is-11 is-two-third-mobile">
        <search-bar :searchTerm="searchTerm" :setSearchTerm="setSearchTerm" :baseUrl="baseUrl" :handleSuggest="handleSuggest" :onSearch="handleSearch"></search-bar>
      </div>
    </nav>

    <ul>
      <li v-for="res in searchResult">
        <a :href="res.link" target="_blank">
          <p>{{ res.title }}</p>
          <div class="media-left">
            <figure class="image is-64x64">
              <img :src="res.image" :alt="res.title"/>
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p v-html="res.highlight.description">
              </p>
            </div>
          </div>


        </a>


      </li>
    </ul>
  </div>
  `,
  data() {
    return {
      searchTerm:'',
      searchOffset:0,
      baseUrl: 'http://localhost:3000',
      searchResult: []
    }
  },
  created () {
    this.searchTerm = this.$route.query.q;
    this.handleSearch();
  },
  methods: {
    async setSearchTerm(term = ''){
      this.searchTerm = term;
    },
    async handleSuggest (term = '') {
      try {
        console.log(`in handleSuggest ${term}`);
        this.searchTerm = term;
        let response = await axios({
          method: 'get',
          url:`${this.baseUrl}/suggest`,
          params: {
            q: term
          }
        });
        return response.data;
        // console.log('in parent autoCompleteResult', this.autoCompleteResult);
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
