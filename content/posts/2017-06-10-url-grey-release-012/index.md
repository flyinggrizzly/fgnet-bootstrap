---
title: 'Url Grey v 0.1.2 release notes'
application: url-grey
release_version: '0.1.2'
layout: release-notes
permalink: :year/:month/:day/:title/
categories: code, app
tags: [url grey, url shortener, release, url grey release notes]
---

This release introduces the ability to use randomly generated slugs for Short URLs.

To accomplish this, the following changes were made:

- Inclusion of `rails-settings-cached` gem to track the currently available random slug number, for base conversion
- Inclusion of the `radix` gem for base conversion into base 37
- Class methods for `ShortUrl` were added to base convert into a custom base 37 alphabet
- A new `before_validation` filter was added to `ShortUrl` to generate a random slug if requested. This is done before validation to ensure that the slug validations are still used

This release also adds `app.json` to automate deployment tasks on Dokku.

## Challenges for a learning dev

This was actually a lot of fun to work on, and quite challenging. I spent the most time on two things:

- figuring out how to generate random slugs
- hooking the slug generator into the existing application

Which... really is most of the application I guess, but both of these things took quite a bit of work.

### Random slug generation lead to infinite loops

My first pass at this wasn't too bad actually. I threw all the available chars for redirects into an array, then `.shuffle`d and `.sample`d it a number of times equal to the random slug's requested length. It was a nice 2 or 3 line method that worked great... until the `uniqueness: true` validation on the slugs kicked in and some started failing.

First fix to this was to recursively recall the method if the slug was taken. However, if you had requested a slug of, say 1 `char`, then there are only 36 possible options (I've disallowed the 37th char, '-', from being used in random slugs). Which means that if you try to recursively call `ShortUrl.random_slug(1)` and all 36 options are taken, you get into an infinite loop. Which `Minitest` pointed out nice and quick.

At this point I considered writing in a fallover so that if the requested length wasn't available, the generator would automatically increase it. But the inifinite loop issue had also made me aware that it was *super* inefficient to be trying to write to the database on *every* pass. Time for a new approach...

### Tracking current random slug with an app setting

So, instead, the app is maintaining a DB table for `AppConfig`. Which I'm intending to use more for other settings later (because it seems silly to have a table with just 1 row). I'm using the [`rails-settings-cached` gem](https://github.com/huacnlee/rails-settings-cached) for this, and it makes it nice and easily. One `generate`, one `db:migrate` and you're up.

This is an integer number, and when the app needs to create a random slug, it turns this number into a a base-37 number using the [`radix` gem](http://www.rubydoc.info/gems/radix/file/DEMO.md). Which allows me to create a custom base-37 alphabet to use in the standard `FixNum.to_s(base)` operation:

```ruby
base_37_alphabet = %w(0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v x y z -)
AppConfig.current_random_slug.b(10).to_s(base_37_alphabet)
```

The only difference between standard Ruby and `radix` is that `.b(base)` method--it tells `radix` what base you're converting from, and then opens up the custom conversion methods after.

### Hooking the generator into the app

So... this actually had me flummoxed for a bit. The previous stuff was complicated, and `radix` helped save me a lot of time, but I could have written my own base conversion tools from scratch if necessary. But hooking it into the app caused me to get in a few fights with 'Rails Magic (TM)'.

First I wrote some tests, because at the least I knew what it needed to do--return slugs of the right length, return unique slugs, and return valid slugs. I've also written a case where a slug requested of a particular length gets elongated if necessary, but that's just for kicks.

First pass I put the logic into the controller, but no matter what I did the validations weren't passing.

So I put some logic into the validations, but they were never getting the right params. So I added a `:random_slug` form element in, and then Rails started bitching at me about unknown methods. A quick Stack Overflow search pointed me to creating a 'virtual attribute' with `attr_accessor :random_slug` in the model, which helped... but then I ran afoul of the validations again.

The logic was trying to replace an empty `:slug` with a random one when randoms were requested, but I couldn't get it to fire at all. It took me longer than I'd care to admit to figure out I should try another filter, this time `before_validation` instead of `_save`, which is what finally fixed the issue. It was a lot of commenting out code and seeing what errors were thrown with each change.

But, we got there in the end!
