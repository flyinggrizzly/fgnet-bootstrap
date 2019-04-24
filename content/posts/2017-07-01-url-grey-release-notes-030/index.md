---
title: 'Url Grey v 0.3.0 release notes'
application: url-grey
release_version: '0.3.0'
layout: release-notes
permalink: :year/:month/:day/:title/
categories: code, application
tags: [url grey, url shortener, release, url grey release notes]
---

This release implements tracking changes to short URLS with [`paper_trail`](https://github.com/airblade/paper_trail).

<!-- more -->

It also changes user permissions for the application. Normal, non-admin users can now create and view all short URLs. Only admins can delete and edit them.

## Paper Trail's documentation is *great*

This release took me probably 45 minutes altogether to create. I already had solid user modelling, which meant that changing the Short URLs controller permissions was changing two lines. It took longer to update the tests than the actual app.

So that was 5 minutes.

The longest chunk of time I spent on this was going through Paper Trail's readme... which took longer not because I was struggling to find information, but because they have it _so well documented_, that I was having fun reading through it. But, the gem is so dang straightforward, that it was a change of maybe a couple dozen lines of code. Again, writing the tests took longer (and a big thank you to [Airblade](https://github.com/airblade) for such helpful docs on testing.)
