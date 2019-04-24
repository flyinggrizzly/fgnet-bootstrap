---
title: Writing my first gem
layout: post
permalink: :year/:month/:day/:title/
categories: code
tags: ruby, dev
---

This week I wrote my first [ruby gem](https://rubygems.org/gems/uss-enterprise). It's pretty great (I think). It does one thing.

It will not make your website better.

It will not make your computer faster.

It will not make you code faster or more efficiently.

But it will do one thing: make you so much cooler because it creates ASCII art of the USS Enterprise.

<!-- more -->

```

--------------------------     ________________        _
-----------------------------  \__(=======/_=_/____.--'-`--.___       
---------------------------              \ \   `,--,-.___.----'
-----------------------                .--`\\--'../
-------------------                   '---._____.|]

```

I've been working my way through [Learn Ruby the Hard Way](http://www.learnrubythehardway.org/book) for the past couple of months, and once you get to exercise 46, you get the instructions to 'make a gem.' I'm not sure how I got from there to this, but I've made something that I will enjoy using for ages. More importantly (watch out, moral incoming!), I've learned some important habits for organizing ruby projects.

If you want to check the gem or code out, the [repo](https://www.github.com/flyinggrizzly/uss-enterprise) is public, so go nuts. I won't promise that it's the best code you'll ever see, but it also ain't half bad. My biggest weakness right now is my ruby vocab, so there are probably a couple places in there where I've coded around a problem that would have been solved by using an existing method. Even then though, I've tried to keep things as readable as possible.

The important things I learned while working on this:

- Keep your classes short and sweet (and by sweet I mean give the methods and attributes good names. And double check those names... if a method returns something, the verb 'get' can be useful. If instead it defines an attribute on its object, then maybe 'define' instead. You'll probably use the return value and the attribute in similar ways, but it's good to know what to expect when you call the method.)
- Keep your files short and sweet. And if it's gonna be long, make sure that the only things in the file *need* to be there.
  - Example: I've got two files: `blueprint.rb` and `schematics.rb`, which could have been concatenated. Schematics defines some classes that create the ASCII art for the different ships, and Blueprint instantiates those, and helps choose the blueprint to output. Logically, they could go together, but splitting them keeps things *way* more readable because there aren't pages of ASCII art cluttering up Blueprint.
    - Also, when I split the schematics off, Blueprint was actually called `blueprints.rb` with an 's', because it contained all the blueprints. Once the schematics were split off, I changed the file and class names in Blueprint to be the verb 'blueprint', without the S. Subtle little difference, but it immediately made coding elsewhere easier because the syntax was closer to actual English.
- Read the damn docs. In an age when I'm slowly losing faith in the slice of humanity that communicates on the internet, the developer community continues to give me hope. The docs don't just have the be the official ones, though the Ruby docs are a work of beauty in their clarity. So many people out there pour so much time into crafting amazing guides to give to the world. Find them, read them. And read Stack Overflow. Sometimes people there are dicks, but most of the time they're good-intentioned dicks.
  - I think next week I'll write a step by step guide myself. Partly to cement this in my own head, and also to help catch the gotchas I hit that other guides gloss over because they're doing less hand-holding. Which is not a criticism, but more an acknowledgement that some people learn by biting off gigantor things and working slowly through them (but might also need some extra help)( <= This is totally me.).
- Super specific, but, don't get screwed by multiple Ruby versions floating around if you've got conflicts between RVM and rbenv. If you uninstall one, make sure you remove it from you `.bash_profile` or `.zshrc`. Rookie mistake that had me banging my head against a wall for hours.
