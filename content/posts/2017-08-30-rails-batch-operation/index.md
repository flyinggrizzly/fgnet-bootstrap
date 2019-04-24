---
title: Adding batch actions to a Rails app
layout: post
permalink: :year/:month/:day/:title/
categories: dev
tags: RESTful, batch operation, ruby, ruby on rails, routing, rspec
edits:
  - 1:
    date: 2017-08-30
    reason: "Update routing solution."
---

I've recently been working on an update to [Url Grey](https://github.com/flyinggrizzly/url-grey), my URL shortener. I recently came across a situation where I wanted to create and update a bunch of short URLs at once, and the only options I had were console witchery, and manually doing it one by one (did the latter). It's the first time the need has come up for me, but it felt like a good combination of thing I'd like to have as an option in the future, and something that would stretch my Rails abilities in the implementation.

<!-- more -->

It definitely did stretch my abilities, and has also highlighted how much I've learned in the short time since I wrote the app as well. Things that came up:

- using Capybara to run acceptance tests 
- switching to RSpec because its opinions about tests make my tests clearer and better (also, caught an issue in my old URL validations when rewriting the model specs)
- custom routing for new RESTful (or semi-RESTful) actions
- writing actions that don't have ready-to-hand model methods to complete (like update and `#save`/`#update_attribute` or `::new` and `#save`/`::create`)
- choosing between `PUT`, `POST`, and `PATCH` for the form method took a lot longer than I thought
- more exercise with Rails form helpers

Generally, I had a lot of fun, but I don't want to spend too much time here. I'll be covering more of this in the [release notes](/url-grey/) when the next version of the URL shortener is finished anyways.

## Capybara and RSPec

I haven't really done too many system/acceptance tests so far; my applications haven't been big enough to need them. But, because the workflow for batch operations bucks the normal Rails set up of having pairs of controller actions (`new` and `create`; `edit` and `update`), I wanted to nail this down a little bit more.

This meant that I opened up the `test/` directory. 

{% include image.html
  img="assets/images/post-images/girl-hides-in-box-in-shame.gif"
  title="a woman hiding herself in a box in shame"
  caption="This is how I feel when I look in the test/ directory right now."
%}

I'd been working through some other bits with RSpec, and the test suite for Url Grey (or rather, the app) is small enough that I actually decided to rewrite the test in RSpec. Practice, better tests, and an easier and clearer DSL. And I've got the beginnings of a feature spec for the batch operation going too. Sounds like a win to me!

## Routing and custom action triples (not pairs!)

OK. Let's be honest. Rails' routing syntax is great. It makes it very easy to expose new routes on some of your controllers, and to declare whether they're available for the collection or for a member:

```ruby
# in config/routes.rb

concern :batchable do
  collection do
    get  :batch
    post :batch, action: :batch_edit_and_new
    put  :batch_update_and_create
  end
end

resources :short_urls, concerns: :batchable
```

This adds three new routes onto your list of available routes. As it's done here, you're going to have the new `#batch`, `#batch_edit_and_new`, and `#batch_update_and_create` actions available on any controller whose routes you add the concern to. You could move that `collection do` block into the short URLs block as well, because I'm probably not going to add batch actions to the other resources, but...

I did it this way because I'm wondering about extracting the code into a gem. Still needs some work before I get there though, but I'm liking having the modular pieces already.

{% include callout.html
  body="I had originally included a similar bit in an initializer as an additional resource route, but that meant that it exposed the `#batch` action on *every* controller, which isn't what I wanted. The concern approach, while it means the code is in the routes file against my preference, means I can call the concern only on the resources which need it. If anyone knows of a way to split the routing concern out into its own file, I'd love to hear it!
  
  I had been trying to use the `ActionDispatch::Routing::Mapper.send(:include, BatchableResourceRoute)` method in an initializer file, but I was getting `set_const` errors (among others). I'm pretty sure that the Mapper is trying to build the routes file before the initializer file was getting parsed, which caused shoutiness."
%}

As you'll note though, there's a third action here, over the normal duos we get in Rails. The `#batch` action is to allow the user to upload a CSV of short URLs to update/create (they happen at the same time). The CSV then gets parsed and handed over to the `#batch_edit_and_new` action, which displays everything the user uploaded for validation. They can also change anything at this point before submitting. This action is pretty much analogous to the `edit`/`new` actions we're used to, except it renders `fields_for` each record being updated or created[^1].

The validated short URL objects then get handed over to the `#batch_update_and_create` action, which runs them all through the standard model validations. Any that pass get saved to the databse, and any that don't get errors from validation added as usual, and are spit back at the user with the errors displayed in the `#batch_edit_and_new` action/template. Wash, rinse, repeat, until all short URLs have been taken care of.

Also, this is where I got a ton of exercise with form helpers, and the almighty `params` object. Whoof-da (so much time with the `params` object).

## PUT vs POST vs PATCH

I spent a lot of time thinking about this. The difficulty was that I was both creating and updating records, which meant that I was torn between `POST` and `PATCH` to match Rails' defaults. On top of that, once short URLs have been created, the only attribute that can be changed is the redirect--the slug is locked into place (though they can be deleted). That made `PATCH` more attractive, especially as it can technically be used for creation... I think? It all gets a little unclear.

What decided it though was the fact that I need an idempotent operator because I had one form for both the creations and updates. That meant that the action had to stick, whether it was new or repeated. Because the URLs being updated had their slugs rendered in spans as uneditable, (and as a hidden field for the form), I wasn't worried about users editing them and getting them spit back, so idempotency wasn't a danger there.

This, plus the fact that `PUT` is designed for both creation and update, and is idempotent, made me go with that. `PATCH` didn't make sense for the new records, and `POST` didn't make sense for the updated records because it was never going to be a full overwrite, and it's not idempotent.

## Wrapup

Anyways. I've still got some work to do on this guy, but we're getting close now. Excited to share it when it's ready.

---

[^1]: I couldn't have done this but without [RailsCast 165](http://railscasts.com/episodes/165-edit-multiple-revised).
