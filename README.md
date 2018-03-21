# mooc_search
MoocSearch is a search engine for online courses from Udemy, Udacity, and Iversity.

## Getting Started
The Application is a multi-container (microservice) application that consist of 3 services, GetCourseServices(where you go get data from Udemy, Udacity, and Iversity), SearchServices (Backend API), and WebServices (frontend). I got all the data from the API, for clean data. However, you can also scrap the websites and store it as a json file. Just be aware of the site terms and policies. I use Elasticsearch as a in-memory database to store all courses from 3 sites, and create a fast rendering retrieval. I will reference the site later on in the Acknowledgement.
Before starting you need to install Docker, Elasticsearch and nodejs, I give the link below in the ```Prerequisites```.
quick start:
- clone your repository
- run ```npm start``` or ```docker-compose up -d --build``` to run application up in detach mode

### Prerequisites
- [Install Docker](https://www.docker.com/community-edition#/download)
- [Install Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html)
- [Install node](https://nodejs.org/en/download/)

## Running the Test
I created test search for (SearchServices)backend API, GetCourse Services, using mocha.
- To test search services: run ```npm test``` or go to SearchServices and run ```npm test```
  - ```cd ./Services/SearchServices```
  - ```npm install```
- To test get course services: ```cd ./Services/GetCourseServices``` and run ```npm test```
- I have not created test cases for WebServices

## Deployment
I deployed the application in Digital ocean cloud service.
- Create a droplet in digitalocean (4GB is recommended but I use 2GB since Elasticsearch is an ad hoc resource database)
- Here is the [instruction](https://docs.docker.com/machine/examples/ocean/#step-3-use-machine-to-create-the-droplet)
- Get environment for the virtual machine that you just created by running: ```eval $(docker-machine env <your docker name>)```
- Get docker-compose.prod.yml to build in the environment and up running: ```docker-compose -f docker-compose.prod.yml up -d --build ```
- Go to the IP address and check out the result

## Built with
- [Node](https://nodejs.org/en/download/)
- [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html)
- [Docker](https://www.docker.com/community-edition#/download)
- [Mocha](https://mochajs.org/)
- [Express](https://expressjs.com/)

## Author
Edward Huang

## License
MIT

## Acknowledgements
- [Tutorial](https://blog.patricktriest.com/text-search-docker-elasticsearch/) that get me started developing with Elasticsearch
- Creating Algorithm from [Search as you type](http://adnanahmed.info/blog/2017/01/28/elasticsearch-search-as-you-type/) with elasticsearch
- Understanding Concepts of [completion suggestor](https://www.elastic.co/blog/you-complete-me) in elasticsearch for autcomplete functionality
- [Deploying webapp with Docker](https://www.devteam.space/blog/how-to-deploy-a-web-app-with-docker-containers/)
- Easy web scrapping [Tutorial](https://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs) for getting courses data
- Search engine [Tutorial](https://lifepacific.libguides.com/c.php?g=155121)
- Creating [Microservice](http://mherman.org/blog/2017/12/07/dockerizing-a-react-app/#.WrHtsZNuZ69) with Docker

### Todo
------
This is just a minimum viable product(MVP) that I create for starting out system side projects after graduated from College. I have always think that there is a problem finding courses online and when you search google there always thousands of different online courses for learning and I get confused by the amount of what to take or which courses are go towards all levels. Therefore, this side project still has a lot of feature if you want to continue.
- filter options (by courses)
- create cron jobs to constantly crawl websites
- creating a user database so that people are able to comment on courses

Any other input or comments please comment below or email me!

Thank you for checking out!
