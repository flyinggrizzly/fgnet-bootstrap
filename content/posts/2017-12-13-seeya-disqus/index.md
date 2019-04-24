---
title: Retiring Disqus
layout: post
category: chatter
tags: disqus, staticman, comments, privacy
edits:
  - 1:
    date: 2017-12-15
    reason: "This post now has a bunch of dumb comments I made while I was working on setting up [Staticman](https://staticman.net). I'll probably update and move them over to an explainer post for the process in the future."
---

Turns out Disqus [just got bought](https://techcrunch.com/2017/12/05/zeta-global-acquires-commenting-service-disqus/), and considering I know bothing about Zeta Global (sounds sinister though), and since I was already kind of on edge about Disqus' privacy stuff, I'm killing the comments on this site.

<!-- more -->

Credit to [Philipp Hansch](http://phansch.net/2017/12/13/no-more-disqus/) who saw this before me, and made the same move.

I've tried this before, but now I think I'm really going to pull the trigger on setting up [Staticman](https://staticman.net/) for comments. It lives in GH issues, which is ace for me.

It's also prompted me to get automated publishing happening here again--all I have to do now is push or merge to my production branch, and Codeship pushes everything to AWS now (which should make getting [scheduled publishing](/2017/07/14/scheduling-posts-jekyll-github-pages/) back easier!)

For those who want to save their comments (like me, with my, like, 3 or 4 comments total), [Disqus have an export guide](https://help.disqus.com/customer/portal/articles/472149-comments-export). No idea how long that will be working though. Do it soon?