var sw = require('stopword');
var title_tag = async(title) => {
  const old_title = title.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'').split(' ');
  const title_arr = sw.removeStopwords(old_title);
  console.log(title_arr);
}

title_tag('Android Basics: Multiscreen Apps').catch(e => console.log(e));
title_tag('Java Persistence: Hibernate and JPA Fundamentals').catch(e => console.log(e));
