---
title: 'Url Grey v 0.1.3 release notes'
application: url-grey
release_version: '0.1.3'
layout: release-notes
permalink: :year/:month/:day/:title/
categories: code, app
tags: [url grey, url shortener, release, url grey release notes]
---

This release protects the application's domain from being redirected to by the app to avoid possible infinite loops or inaccessible application routes.

To accomplish this, the following changes were made:

- A new custom validator, `safe_redirect_validator.rb` was added
- An additional validation was added to the `ShortUrl` model

### Further work

The validator could easily be extended to check requested redirect targets against an array of blacklisted domains, rather than just the application domain. I have no need for this personally, but it's worth noting as it could be useful to others.

## The big learn

The [Addressable](https://github.com/sporkmonger/addressable) gem saved a lot of hackwork on this one. The validator needed to be able to assess redirects with and without schemes (schemes are prepended `before_save`, not `before_validation`), which Ruby's inbuilt `URI` has difficulty with: `URI.parse('www.google.com').host` returns `nil`, becuase `URI` doesn't parse the unqualified URL.

Using `Addressable::URI.heuristic_parse('www.google.com')`, the return object is fully qualified and will respond to the `.host` method. 

Once that was in place, checking against the application's host (set in `application.rb`) was easy. There was a while where I ran around in circles trying to get Rails to see it's own address, but because of the reverse-proxied architecture in production and staging, it just kept returning meaningless values. The workaround would be to make an actual HTTP request externally and see what the response says about ourselves... but that could take for *ever*. Faster to just tell the app who/where it is.
