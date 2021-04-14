'use strict';
/*Handlebars*/
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  /* Done remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* Done add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* Done remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const href = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const currentArticle = document.querySelector(href);
  /* add class 'active' to the correct article */
  currentArticle.classList.add('active');
}

const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: 'tags.list',//1
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.authors.list'
};

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  let html = '';
  /* for each article */
  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
    /* Handlebars create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into html variable */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999,
  };
  for(let tag in tags){
    
    if (tags[tag] > params.max){
      params.max = tags[tag];
    }
    if (tags[tag] < params.min){
      params.min = tags[tag];
    }
  } 
  return params;
}
function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1 );
  
  return opt.cloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagWrapper = article.querySelector(opt.articleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array Dzielimy tekst na tablicę */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      /* HANDLEBARS generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.sidebar .tags');
  
  const tagsParams = calculateTagsParams(allTags);
  /* [NEW]create variable for all links HTML code */
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in all Tags: */
  for(let tag in allTags) {
    /* Handlebars cloud [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  let href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks) {
    /* remove class active */
    activeLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const foundTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let foundTagLink of foundTagLinks) {
    /* add class active */
    foundTagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linkTags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let linkTag of linkTags) {
  /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function calculateAuthorsParams(authors) {
  const params = {
    max: 0,
    min: 999999,
  };
  for(let author in authors){
    if (authors[author] > params.max){
      params.max = authors[author];
    }
    if (authors[author] < params.min){
      params.min = authors[author];
    }
  } 

  return params;
}
function calculateAuthorsClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1 );
  
  return opt.cloudClassPrefix + classNumber;
}

function generateAuthors(){
  /* [NEW] create a new variable allTags with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* HANDLEBARS generate HTML of the link */
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* add generated code to html variable */
    html = html + linkHTML;
    /* [NEW] check if this link is NOT already in allTags */
    if(!allAuthors.hasOwnProperty(articleAuthor)) {
      /* [NEW] add tag to allTags object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* insert HTML of all the links into the tags wrapper */
    authorWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const authorList = document.querySelector(opt.authorsListSelector);
  const authorsParams = calculateAuthorsParams(allAuthors);
  /* Hanndlebars [NEW]create variable for all links HTML code */
  const allAuthorsData = {authors: []};
  /* [NEW] START LOOP: for each author in all authors: */
  for (let author in allAuthors) {
    /* Handelbars [NEW] generate code of a link and add it to allAuthorsHTML */
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateAuthorsClass(allAuthors[author], authorsParams)
    });
  }
  /* Handelbars [NEW] add html from allauthors to authorList */
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-author-', '');
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-author-"]');
  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks) {
    /* remove class active */
    activeLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const foundAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let foundAuthorLink of foundAuthorLinks) {
    /* add class active */
    foundAuthorLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags="' + tag + '"]');
}
function addClickListenersToAuthors() {
  /* find all links to tags */
  const linkAuthors = document.querySelectorAll('a[href^="#tag-author-"]');
  /* START LOOP: for each link */
  for (let linkAuthor of linkAuthors) {
  /* add tagClickHandler as event listener for that link */
    linkAuthor.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();



//popup


//When the user clicks on <div>, open the popup
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}
