---
title: Using ES6 to rewrite old code
layout: post
category: code
tags: javascript, es6, refactor, growth, development
---

About 3 years ago I took my first stab at creating this website. It was part of my work in General Assembly's Front-end development course, which was one of my intros to development (the other being Harvard's free intro comp-sci course, [CS50](https://www.edx.org/course/introduction-computer-science-harvardx-cs50x), which I can't recommend enough). The thing that I really wanted to have on here was search for posts, without any backend functionality. This meant JavaScipt, and man was it friggin' ugly.

<!-- more -->

It wasn't ugly because JavaScript is ugly, though I could do with fewer semicolons, but ugly because a) this was older and less beginner friendly JavaScript, and b) I was a beginner.

The code watched an input box on the page, and then added or removed CSS classes to hide or show different posts that were all already on the page, with `visibility: none;`. It wasn't a terrible approach, considering the constraint that it all be entirely in-browser.

The actual code though... one of the first problems was that I structured it like a C program, and kept trying to enforce C style on it (side-effect of doing CS50 concurrently).

It was kind of a mess, and was really buggy. You had to type a space and a character beyond a word before it would actually fire; I never got around to fixing it either. I don't even think I have the code lying around. Pretty sure I burned the repo to the ground and salted the earth. Just kept a couple of the posts.

## search take 2

I've just put search [back in](/search/) (it only works with JavaScript, so heads up. Also, if it's not in the nav, it's cuz the link only gets injected with JavaScript after page load). Long story short... it's a lot cleaner than it was before.

In part, this is because ES6 makes writing JavaScript a lot nicer, and makes more eloquent code a lot more achievable. The new `Array.prototype` methods are clutch (though, let's be honest, why the frack did it take this long to get `.filter` or `.map` in?).

I've also gotten better at naming methods and variables so they're clear and descriptive. I've written the code in stops and starts, and coming back and picking up where I left off has been a lot easier.

The way it works is the site spits out a [JSON file](/search/search.json) with metadata for each post when Jekyll builds everything. When the search page loads, it pulls that through and waits for a user to start typing in the search box. 

On every `keyup`, it checks for matches in the post title, tags, category, and excerpt fields. For each match it replaces that sub-string with a `<span class="hl">` to make it apparent why a result is being returned (tags aren't rendered yet, so some matches don't have the highlight).

What I'm most proud of though, is how readable this code is, with few comments. It's a big jump from the old code, which was an unreadable mess, even heavily commented (to my credit, I did comment like whoa).

Also, big thumbs up to JavaScript for getting some sweet array methods, and string literals for interpolation, finally out the door! Still don't like the liberal use of camelcase though.

If you're curious, here's the (new) code:

```javascript
const endpoint = '/search/search.json';
const posts = [];
fetch(endpoint).then(blob => blob.json())
                .then(data => posts.push(...data));

function findMatches(word_to_match, posts) {
  // if no search input, prevent global match to empty string
  if (isEmptyOrNull(word_to_match)) {
    return [];
  }
  return posts.filter(post => {
    const regex = new RegExp(word_to_match, 'gi');
    return post.title.match(regex) || post.tags.match(regex) || post.categories.match(regex)
  });
}

function isEmptyOrNull(str) {
  return (!str || /^\s*$/.test(str));
}

function displayMatches() {
  const match_array = findMatches(this.value, posts);
  const html = match_array.map(post => {
    const regex = new RegExp(this.value, 'gi')
    const post_title = post.title.replace(regex, `<span class="hl">${this.value}</span>`);
    const post_excerpt = post.excerpt.replace(regex, `<span class="hl">${this.value}</span>`);

    return `
      <div class="post">
        <div class="post-heading">
          <h1><a href="${post.link}">${post_title}</a></h1>
          <span><a href="${post.link}">${post.date}</a></span>
        </div>
        <p class="post-excerpt">${post_excerpt}</p>
        <p>&#187; <a href="${post.link}">Read post</a></p>
      </div>
    `;
  }).join('');
  
  search_results.innerHTML = html;
}

function preventSubmission() {
  return false;
}

function captureSubmissions() {
  window.captureEvents(Event.SUBMIT);
  window.onsubmit = preventSubmission;
}

const search_input = document.querySelector('#q');
const search_results = document.querySelector('#search-results');

search_input.addEventListener('change', displayMatches);
search_input.addEventListener('keyup', displayMatches);

document.addEventListener("DOMContentLoaded", captureSubmissions);
```

