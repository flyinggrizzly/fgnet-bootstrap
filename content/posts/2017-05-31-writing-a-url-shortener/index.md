---
title: Writing a URL shortener
layout: post
permalink: :year/:month/:day/:title/
categories: code, app
tags: ruby, rails, dokku
---

It's been quite a while since [my last post on TDD]({{ site.baseurl }}{% link _posts/2017-04-11-test-should-bring-joy-do.md %}), and I have promised myself that I would get something out before the end of the month, so this may be a little slap-dash. Especially considering that today it's my anniversary and there are bigger things on my mind!

Over the last 2 weeks, I've been writing a URL shortener in Rails, and I've now got it to a point where I'm using it personally on the great wide internets! I call it **Url Grey**, and the code is all [on Github](https://github.com/flyinggrizzly/url-grey). It's still got some work to do, but getting this far has been a ton of fun, and a massive (and useful) learning experience.

<!-- more -->

{% include image.html
  img="assets/images/post-images/picard-tea.gif"
  title="TEA, EARL GREY, HOT!"
  caption="Oh captain, my captain!"
%}

Writing this sucker has pushed me to go beyond the tutorials, and to really reason things out for myself. The moment that really sticks out for me was when I was trying to figure out how to redirect short URL requests to their destinations. Most of the time, Rails' `redirect_to` helper just points users to a different location on the site. But I was sitting there scratching my head about how to nudge the users browser back away from the app when it hits up a short URL... and I says to myself I says "Sean, me boy, I wonder if I can just `redirect_to` them out of here?" So I wrote a test for it, wrote a quick method to test it, and holy crap it works!

How did I get to URL shortener? Weirdly. This project started off as a platform to learn more about the [Foundation framework](https://foundation.zurb.com). Which I started in a Jekyll project, and then got bored. Because I've already got a static site I use. I didn't need another one I would just throw away. Meanwhile, I had been looking at the short URL generator we use at work and thinking about giving it a reverse search option (would be *so* helpful for making sure we don't dupe short URLs), and figured what they hey, let's look at something like that. I've been wanting to move myself off of Bitly, and this sounded like a good way to do kill several birds with one stone.

Starting off was easy--modelling users is not a difficult thing to do for a basic application like this (though I did dance for a moment with the idea of having several user types defined by string... but without a clear need for it I didn't want to spend the time on managing logic beyond the boolean). Controllers, too, weren't bad, though I insisted on adding a a `delete` action and view to ensure the ability to delete objects was present, even when Javascript is not. 

There's a great [Railscast about this](http://railscasts.com/episodes/77-destroy-without-javascript) that I followed for adding non-Javascript delete: add [the action to the relevant controller](https://github.com/flyinggrizzly/url-grey/blob/staging/app/controllers/short_urls_controller.rb), add a [view to render a delete button in a form](https://github.com/flyinggrizzly/url-grey/blob/staging/app/views/short_urls/delete.html.erb), and add an [initializer](https://github.com/flyinggrizzly/url-grey/blob/staging/config/initializers/delete_resource_route.rb) that will modify all resources in the application so delete is included in the `resources :users` declaration. Once that's done, wherever you would normally include

```ruby
<%= link_to 'Delete', destroy_short_url_path(short_url), method: delete %>
```

instead use a modified version:

```ruby
<%= link_to 'Delete', [:delete, short_url], method: delete, data: { confirm: 'Are you sure?' }  %>
```

Whenever JS is enabled, this will run as normal. But, when JS isn't available (or is bypassed by using right click > open in new tab/window), this issues a get request for the `delete` view, which has a form. Either way, you've got confirmation of delete, and support for non-JS users. Huzzah!

Aside from that, this was mostly just good clean Rails fun--put in the time, and get out an app. Once again, though, this process was *super* easy because having good test coverage meant I could run around breaking things without worrying. At one point I renamed the entire project (I only thought of the name after my wife was telling me about someone she had met who kept referring to URLs as 'earls'), and the only reason I had the balls to do so without spending several hours hunting through my editor's 'Find in Project' results was the tests. The peace of mind is lovely. I'm getting kind of addicted to watching my test progress bar run now.

The only time I hit a snag was when I was looking for a way to deploy. Until this point I had been pushing it up to Heroku to check it out, but Heroku is expensive for apps that you'd like to have running all the time (like a URL shortener). I spent far longer than I'd care to remember fighting with Elastic Beanstalk (which I'm sure is great, just not clear) on AWS because I was looking for something Heroku-esque in its simplicity--build app, test app, and push app to live with git. AWS is not that. 

(Oh. Speaking of snags. There was also the time that I woke up in the middle of the night having figured out how to redirect the application's root url as a special redirect (if you hit [grz.li](https://grz.li) it redirects you here). After muddling around with logic in the `routes.rb` file, and some misguided attempts to do stuff based on the environment, and then testing based on the environment I trashed all the changes... then woke up at 2am with the fix. That was not fun. Anyways. Back to the deployment thing.)

After a fair bit of hunting, I found [Dokku](http://dokku.viewdocs.io/dokku/), which implements a subset of the Heroku API on your own VPS. And it's *stupid* easy to setup--clone a bootstrap script from the Dokku repository, run it and you're away. I'm paying ~$5 a month for a VPS on Linode with 1GB ram, which meets Dokku's minimum requirement. There are plugins for [Postgres](https://github.com/dokku/dokku-postgres) and [Let's Encrypt](https://github.com/dokku/dokku-letsencrypt), and it's easy to deploy to from Codeship using their custom deploy scripts (you declare a remote, and push to the remote after adding [Codeship](https://www.codeship.com)'s public key to your Dokku server).  

That said, there were still some things with Dokku that tripped me up, and that merits its own future post I think.

Speaking of Codeship though, this is the first application that I've set any kind of automated deployment up with! It's very cool to have Codeship automatically run my tests again on a push to my staging branch, and deploy the app to the staging instance (I've got both staging and production for this sucker!). I'm thinking I'd like to checkout [Circle CI](https://circleci.com) at some point too, because I like the idea of including deployment instructions as code with the application, rather than having it separate (and therefore not VCS tracked) in Codeship. Regardless, Codeship is great, and I've got that hooked into [Code Climate](https://codeclimate.com) as well and put those cool little badges on the GH readme.

So yea. Built an app. It feels good.

It's MIT licensed, so go nuts, fork it. There's also a list of things I still need to implement in the readme in the repo if you feel like creating a PR. It's at [grz.li/url-grey](https://grz.li/url-grey).
