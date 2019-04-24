---
title: Creating a series of posts in Jekyll
layout: post
permalink: :year/:month/:day/:title/
categories: code
tags: jekyll, github pages, liquid, related posts
---

This post is a bit similar to [last week's]({{ site.baseurl }}{% link _posts/2017-07-14-scheduling-posts-jekyll-github-pages.md %}) because it describes a solution I came up with for an issue in writing my [automated deployment to Dokku series (link to first post)]({{ site.baseurl }}{% link _posts/2017-06-09-setting-up-dokku.md %}): how to programmatically link to other posts in a series without having to manually write markdown links.

<!-- more -->

There are a lot of ways to do this, but I had a few stipulations:

- I wanted to use Jekyll's [`_data` directory and function](https://jekyllrb.com/docs/datafiles/) to have a canonical list of series, and their posts
- I wanted to note the series in a post's front matter
- With those in place, an include in the `post.html` layout should activate and insert an aside describing the series, and linking to the posts
- The aside should automatically update when new posts are added to the series
- I wanted this to be performant so as not to slow down Jekyll builds
- The solution should be as [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) as possible

The biggest tension in those requirements is the balance between being DRY and performance. I've come out with a solution that requires one step of repetition that could be avoided (and one which couldn't, and you wouldn't want to anyways), which I'll come to. First I'll describe the solution, then hit the niggling issues.

## Using Jekyll's data functions to canonically track series

In my site's `_data/` directory, I've added a file: `_data/series.yml`. Inside this file I describe all series on the site (at the moment it's just one):

```yaml
dokku-automated-deployment:
  title: "Automated deployment of Rails apps with Dokku"
  description: "This series looks at using [Dokku](http://dokku.viewdocs.io/dokku/) to deploy (Rails) apps. The concepts should hold regardless of what language/framework you're using, though some of my examples may be Rails specific."
  posts:
    - 1:
      title: "Dokku: Setting up Dokku"
    - 2:
      title: "Dokku: Automated Builds and Testing"
    - 3:
      title: "Dokku: Automated deployment to Dokku"
    - 4:
      title: "Dokku: Backing up apps on Dokku"
```

This includes the series title, description, and posts, all of which are used to render the series slug at the top of each post in the series. Storing the series' data here like this feels nice, because it's very similar to writing front matter for posts. This time, it's not for a single page, but for a logical group of pages. I like this use of `_data/` in Jekyll.

Note the post titles for a second--they are identical to the titles in the posts' front matter. This is the one repetition I mentioned earlier, and we're still going to come back to it. Just wanted to flag it.

## Declaring series in post front matter

This was actually the first step I took--it feels totally logical that the series should be part of a post's front matter--it's where *all* the metadata goes.

Any post in a series needs to have it in the front matter:

```yaml
---
title: Dokku: Setting up Dokku
layout: post

# This line has to be included
series: dokku-automated-deployment

tags: dokku, set up, vps, heroku, cheap
---
```

This is the step of repetition that shouldn't be avoided--declaring the series name in the front matter. It has to match the series name (not title, though you could work with that too) in the `_data/series.yml` file.

## The fun part: automatically generating series information in relevant posts

With those two pieces in place, we are now able to automatically generate a slug for the series at the top of posts in it.

I added an include to my `post.html` layout callled `series-slug.html`:

```html
{% raw %}
---
layout: default
---

{% include series-slug.html %}

{{ content}}
{% endraw %}
```

The include is as follows:

```html
{% raw %}
<!-- Only use the following code if the post has a series ->
{% if page.series != nil %}

  <!-- Use the post's series name to grab -->
  <!-- the right series out of _data/series.yml -->
  {% assign series = site.data.series[page.series] %}

  <!-- The series-slug class is for -->
  <!-- styling - you can do whatever -->
  <aside class="series-slug">

    <!-- Render the series title -->
    <!-- from _data/series.yml -->
    <h3 class="series-title">Series: {{ series.title }}</h3>

    <!-- Render the series description -->
    <!-- from _data/series.yml -->
    <p>{{ series.description | markdownify }}</p>

    <!-- Get ready to list each post in the series -->
    <h4>Posts in this series:</h4>
    <ul class="series-posts">

      <!-- Here's where it gets weird. -->

      <!-- We're going to open two loops: -->
      <!-- The first loop goes through the -->
      <!-- post titles in _data/series.yml; -->
      <!-- and the second compares that title -->
      <!-- to the titles of every post in the -->
      <!-- site. -->

      <!-- It's important to run through the -->
      <!-- series bit first, otherwise you -->
      <!-- would be looping through a much larger -->
      <!-- array: all of the posts on the site. -->

      <!-- If the titles match, we will create -->
      <!-- a list item, and render it -->
      <!-- with a link to the post. -->
      {% for entry in series.posts %}
        {% for post in site.posts %}
          {% if entry.title == post.title %}

            <li>
              <!-- This del tag is mostly for dev -->
              <!-- and drafting, because the post.date -->
              <!-- will never be greater than site.time -->
              <!-- if your site has future: false set -->
              <!-- in _config.yml. See my scheduling post -->
              {% if post.date > site.time %}
                <del>
              {% endif %}

                <a href="{% if post.date > site.time %}
                            #
                         {% else %}
                           {{ site.baseurl }}{{ post.url }}
                         {% endif %}">{{ entry.title }}</a>

               <!-- From here we're just closing tags and -->
               <!-- loops. Take it away Sam! -->
              {% if post.date > site.time %}
                </del>... post not published yet.
              {% endif %}
            </li>

          {% endif %}
        {% endfor %}
      {% endfor %}

    </ul>

  </aside>
{% endif %}
{% endraw %}
```

To recap what the comments in there are saying:

- If the post has a series, then build the include
- In the include, use the post's series name to find the right series in `_data/series.yml`
- Loop over every post declared in that series in `_data/series.yml` and compare its title to the titles of every post in the site
  - It's important to do it in this order rather than looping through every post in the site and comparing to the titles of posts in `_data/series.yml` because one of those numbers is potentially *much* bigger than the other
- When you find a match, create an `li` with a link to the post
  - And for dev/drafting ease (when using the `--future` flag with Jekyll locally) strike out the names of posts that will be published in the future
- Close all your tags and loops

## Repetition and niggles

There's an obvious refinement to be made in terms of avoiding repetition: don't list the titles of the posts in `_data/series.yml`, and just declare the series in post front matter. This means that you just have the title and description in the data file, and there isn't the weakness of having to remember to copy the post title in exactly to `_data/series.yml` (and update it should it change).

The reason that I haven't done this yet (though I probably will soon), is that Jekyll can slow down quickly if you have a lot of looping logic in the build. Declaring the series only in the post front matter will force the `series-slug.html` include to loop over *every* post in the site for *every* series I create to compare series names instead of post titles. The advantage to the including the post titles in the data file is that it scopes series slug creation to a number of loops equal to the number of posts in a series.

In the end though, for a site the size of [flyinggrizzly.io]({{ site.baseurl }}), the performance difference is of far less importance than the inevitable forgetfulness of the meatbag at the keyboard. Jekyll builds will take an extra second, which isn't that important compared the the fact that I *will* forgot to copy-paste at some point.


¯\\\_(ツ)_/¯




{% include callout.html
   heading="PS: Escaping liquid tags in code blocks in Jekyll"
   body="I ran into an issue trying to include the code blocks above because Jekyll kept trying to interpret the liquid tags in them. You need to use Liquid's `raw/endraw` tags to do it. Which I'm not going to do here, because they have trouble escaping themselves. Check out [this blog post](http://blog.slaks.net/2013-06-10/jekyll-endraw-in-code/) if you want to try that though."
%}
