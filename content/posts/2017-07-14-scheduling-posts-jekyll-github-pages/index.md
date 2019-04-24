---
title: Scheduling posts with Jekyll and Github Pages
layout: post
permalink: :year/:month/:day/:title/
categories: code
tags: jekyll, github pages, scheduled post, cron, cronjob, scheduling
---

For a while I've been looking for a way to schedule posts for this blog, which is being hosted on [Github Pages](https://pages.github.com/). Because Jekyll is a static site generator and not a full CMS, there isn't an inbuilt way to do it. I had found a post about using Zapier to merge in feature-branches for every new post to get this working, but when I was looking at it, it didn't really appeal, in large part because it requires giving full access to your repo to Zapier.

When I started putting together the [automated dokku test and deployment series (link to first post)]({{ site.baseurl }}{% link _posts/2017-06-09-setting-up-dokku.md %}), it got to the point where I *needed* scheduling, because I was writing the posts on vacation all at once, but didn't want them to go live all at the same time. So I ended up hacking together a quick and dirty fix with a VPS running a cronjob.

<!-- more -->

This of course assumes that you have access to a VPS, or at least some network connected *nix machine that's always on, and has both SSH and cron running. If so, there are 3 things you need to do:

1. tell Jekyll not to publish future posts
2. set up SSH access for the VPS (or whatever) to Github
3. write the publish script and schedule it with cron

## Configuring Jekyll not to publish future posts

This *should* be the default behavior as of Jekyll 3, but it doesn't seem to work on Github Pages at least. The good news is that the config method from Jekyll < 3 still works in 3.

In your site's `_config.yml`, add a (top-level) entry like so:

```yaml
title:        'Flying Grizzly'
description:  'D&D, chatter, and learning how to dev'
url:          'http://flyinggrizzly.io'
baseurl:      ''
permalink:    /:year/:month/:day/:title/

# Add this line
future:       false
```

This *explicitly* tells Jekyll, regardless of version[^1], that posts with future dates should *not* be published. If you're following the standard method of giving posts dates in the filename, like `2017-07-14-scheduling-posts-jekyll-github-pages.md` that should be all you need to do. If you're not, you can [add dates into a post's frontmatter](https://jekyllrb.com/docs/frontmatter/#predefined-variables-for-posts):

```yaml
---
title: Scheduling posts with Jekyll and Github Pages
layout: post
tags: jekyll, github pages, scheduled post, cron, cronjob, scheduling
date: 2017-07-14
---
```

This is important, because to schedule posts, they need to be sitting like ticking time-bombs in the `_posts` directory so a periodic push to the repo that triggers a site rebuild will pick them up at the right date.


{% include callout.html
  heading="Previewing future dated posts (and drafts)"
  body="
If you want to preview and/or proofread a future dated post on your machine, when you run Jekyll locally, just append the `--future` or `--drafts` flags to the `jekyll serve` command:

```bash
$ bundle exec jekyll serve --future --drafts
```

You should now see all posts with future dates, and from the `_drafts` folder on localhost."
%}

## Adding SSH keys for your VPS and clone the site repo

I'm just going to leave it to [Github's SSH docs](https://help.github.com/articles/connecting-to-github-with-ssh/) to go through this one. Same theory, different machine.

One thing--unless you want to faff around with `expect` in your publishing script, don't set passphrases on the SSH keys.

Next, you should clone the site's repository to a convenient location. I've got it in the user's home folder, but put it wherever you want.

## Scheduling publishing

This is the fun part!

You can write this whole thing as a cronjob in the crontab, but I find it easier to create a script that cron can fire off. I keep these in a `scripts/` directory in my user's home folder, but keep yours wherever you want.

```bash
#!/bin/bash

# Start the SSH agent
eval $(ssh-agent -s)

# Ensure our key is loaded and ready so Github accepts our push/pull
ssh-add /home/seandmr/.ssh/id_rsa

# Hop into the site repo, wherever you cloned it to
cd /home/seandmr/flyinggrizzly.io

# This shouldn't matter, but just in case make sure you're on the site's publication branch--change this to whatever branch your site builds from
git checkout gh-pages

# Fetch any new changes, otherwise your upcoming push will be rejected
git pull origin gh-pages

# Create an empty commit so you can push
git commit -m 'nightly build to publish new posts' --allow-empty

# Pushing to GH will trigger a new site build for GH Pages
git push origin gh-pages
```

The only tricky things to note here are the `git pull`, and the `git commit -m 'nightly build to publish new posts' --allow-empty`.

The `git pull origin gh-pages`, as the comment above says, is important, because if there are new scheduled posts not on the VPS, and the VPS tries to push to the repo, Github will reject the push because the VPS is not up to date.

`git commit -m 'nightly build to publish new posts' --allow-empty` creates an empty commit. The `--allow-empty` flag is important, otherwise there won't be a commit and Github will reject the push because it will think everything is up to date.

Don't forget to make the script executable:

```bash
$ chmod +x nightly-site-build.sh
```

### Cron

With that done, time to set the cronjob (`$ crontab -e`):

```bash
SHELL=/bin/bash
PATH=/home/your_user/bin:/home/your_user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Republish flyinggrizzly.io on GH pages with an empty commit and push
01 01 * * * /home/your_user/scripts/fgio-nightly-build.sh

### Do not add cronjobs below this line, or delete the empty lines after it. ###


```

## Issues

Not issues per se, though I'm not working in a critical environment:

1. This isn't testable
2. You're creating a lot of commit noise

I've checked the commit history on Github periodically since I set this up, and the commits are there and schedule posts are being published, but there really isn't a way to actually test this. So YMMV.

The commit noise is maybe the bigger issue... but at least for [flyinggrizzly.io]({{ site.baseurl }}), it's still mostly a personal site with only me working on it, so I can deal with that. I did think long and hard about the commit message though, so at least it's clear what these commits are for.

## Wrapup

That's about it really. If you've figured out a better way to do this, please let me know--tinkering is fun.

---
[^1]: That said, I haven't tested this in Jekyll 1.xx.
