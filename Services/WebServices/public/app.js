// https://jsfiddle.net/yyx990803/xgrjzsup/

// Global variable
Vue.use(Buefy.default)
// const host ='http://localhost:3000';
const host =  'http://167.99.56.190:3000';
const searchUrl = host;

// searchbar components
// keyup.enter.native to get the eventhandler to work on autocomplete
const SearchBar = Vue.component('search-bar', {
  template:`
  <section class="search-bar">
    <b-field>
      <b-autocomplete
                rounded
                v-model="searchTerm"
                :data="autoCompleteResult"
                :loading="isFetching"
                placeholder="e.g. jQuery"
                icon="magnify"
                :open-on-focus="openOnFocus"
                @input="onSearchInput"
                @keyup.enter.native="onEnterPress()"
                @select="option => selected = option">
                <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
  </section>
  `,
  props:['searchTerm','setSearchTerm','baseUrl','handleSuggest','onSearch'],
  data () {
    return {
      autoCompleteResult: [],
      isFetching:false,
      searchDebounce: null,
      selected: null,
      openOnFocus:true
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
    },
    async onEnterPress(){
      this.onSearch().then(() => {
        this.$router.go();
      });
    }
  }
});

// Submit Button (triggered Search)
const Submit = Vue.component('submit', {
  template:`
    <button type="button" class="button is-light is-medium" name="Submit" v-on:click="onSearch()">Submit</button>
  `,
  props:['onSearch']
});

const Pagination = Vue.component('pagination', {
  template:`
    <section>
        <b-pagination
            :total="numHits"
            :current.sync="current"
            :order="order"
            :size="size"
            :simple="isSimple"
            :rounded="isRounded"
            @change="val => valChanged = val"
            :per-page="perPage">
        </b-pagination>
    </section>
  `,
  props:['numHits','searchOffset','handlePageResult'],
  data () {
    return {
      order: '',
      size: '',
      current: 1,
      isSimple: false,
      isRounded: true,
      perPage:10,
      valChanged:1
    }
  },
  watch: {
    valChanged(newVal, oldVal){
      this.handlePageResult(newVal,this.perPage);
      this.current = newVal;
      console.log(this.current);
      // console.log(newVal*this.searchOffset);
    }
  },
  methods: {
  }
});

// FrontPageContainer
const FrontPageContainer = Vue.component('front-page-container',{
  // need to defined the template like in react
  template: `
    <transition name="fade">
      <div class="container is-fluid front-page">
        <label class="label hero-title">Mooc_Search</label>
        <search-bar :searchTerm="searchTerm" :setSearchTerm="setSearchTerm" :baseUrl="baseUrl" :handleSuggest="handleSuggest" :onSearch="handleSearch"></search-bar>
      </div>
    </transition>
    `,
  data() {
    return {
      searchTerm:'',
      selected: null, // select the term
      searchOffset:0,
      baseUrl: searchUrl,
      searchDebounce: null,
      searchResult: [],
      autoCompleteResult: []
    }
  },
  methods: {
    async setSearchTerm(term = ''){
      this.searchTerm = term;
    },
    async handleSuggest (term = '') {
      try {
        // console.log(`in handleSuggest ${term}`);
        this.searchTerm = term;
        // console.log(`searchTerm ${this.searchTerm}`);
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
    <tansition name="fade">
      <nav class="columns">
        <div class="column is-3 is-one-third-mobile">
          <label class="label hero-subtitle" @click="back()">Mooc_Search</label>
        </div>
        <div class="column is-7 is-two-third-mobile">
          <search-bar
            :searchTerm="searchTerm"
            :setSearchTerm="setSearchTerm"
            :baseUrl="baseUrl"
            :handleSuggest="handleSuggest"
            :onSearch="handleSearch"></search-bar>
        </div>
      </nav>
      <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>

      <ul class="result-list" >
        <li v-for="res in searchResult">
          <div class="box box-container">
            <article class="media">
              <div class="media-left">
                <figure class="image is-64x64">
                    <img v-if="res.image.length > 0 ":src="res.image.length > 0 ? res.image : './assets/courseIcon.png'"  :alt="res.title"/>
                    <img v-else src="./assets/courseIcon.png" alt="broken" />
                </figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <a target="_blank" :href="res.link"><strong> {{ res.title }} </strong></a>
                  <small>{{ res.currency }}</small>
                  <p>{{ res.language }}</p>
                  <div class="subtitle description" v-html="res.description"></div>
                </div>
              </div>
            </article>
          </div>
        </li>
      </ul>
      <pagination class="pagination" :numHits="numHits" :searchOffset="searchOffset"
        :handlePageResult="handlePageResult"
        ></pagination>
    </transition>
  </div>
  `,
  data() {
    return {
      searchTerm:'',
      isLoading: false,
      searchOffset:0,
      baseUrl: searchUrl,
      searchResult: [],
      numHits: null // total search result found
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
    back() {
      this.$router.push({path:'/'});
    },
    async handleSuggest (term = '') {
      try {
        // console.log(`in handleSuggest ${term}`);
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
          console.log(`${this.searchTerm}`);
          console.log(`There in handle search search-container component`);
          this.isLoading = true;
          let response = await axios({
            method: 'get',
            url: `${this.baseUrl}/search`,
            params: {
              q: this.searchTerm,
              offset:this.searchOffset
            }
          });

          console.log(response.data);
          this.searchResult = response.data.searchHitResult;
          this.numHits = response.data.numHits;

          console.log(this.numHits);

          // push router to /search
          this.$router.push({path:'/search', query:{q:this.searchTerm }});
          this.isLoading = false;


          // console.log(this.searchResult);
        } catch (e) {
          console.error(e);
        }
      }
    },
    async handlePageResult(newVal,perPage) {
      this.searchOffset = (newVal-1)*perPage;
      if(this.searchOffset + 10 > this.numHits) {
        this.searchOffset = this.numHits-10;
      }
      await this.handleSearch();
      document.documentElement.scrollTop=0;
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
