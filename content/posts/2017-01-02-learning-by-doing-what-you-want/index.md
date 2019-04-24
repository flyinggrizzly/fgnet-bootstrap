---
layout: post
permalink: :year/:month/:day/:title/
title: Learning by doing what you want
category: code
tags: leaning, motivation, wiki, server, diy
---

This winter break (which is something I haven't had in some time--it's fantastic!) I put together my own [Confluence wiki](https://www.atlassian.com/software/confluence). I'm really enjoying it because I've now got a place to dump *all* of my things that's accessible to me anywhere, searchable, and pretty safe. I'm also using it to collaborate with the players in an upcoming D&D campaign, and the insanely fine-grained control Confluence gives you over access to pages is a DM's dream come true.

Turns out, this was a pretty good learning experience for me too. It was a project and outcome I was invested in, and that started me off on the whole thing with excitement and momentum.

<!-- more -->

Building some kind of wiki is something I've been contemplating for a while--I clip a lot of articles from around the web as HTML/CSS files, and I've been trying to figure out some place to store them that would also display them--things like [Devonthink](http://www.devontechnologies.com/products/devonthink/overview.html) do the thing, but it always lives locally. Another option would have just been to have Jekyll build up all these files into a randomly assorted collection... but Jekyll doesn't do metadata or organization the way I wanted. And searchability would take a hit. Plus, if I were to host it online so I can get to it anywhere, I'm then reproducing other people's work without permission. Not great.

I've been using Confluence at my new job at the University of Bath--and it really isn't bad. No one is ever going to award any Atlassian product a trendiness award, but they are damned if they're not functional.

I had also set up a JIRA instance for myself in a misguided attempt to create a personal Kanban-style to-do list. It *worked*... but it was overkill. ([Trello](https://www.trello.com) does me just fine, and I thankya). But the experience *did* provide me with a little more confidence for doing things better this time with Confluence.

### What I did

I wanted to set up Confluence on a VPS (check out [Lunanode](https://dynamic.lunanode.com/info?r=5948)--one of the cheaper and [better reviewed](https://www.lowendtalk.com/discussion/30067/kudos-to-luna-node-for-great-service) VPS providers I've seen. And yes, that's a referral link). The one big downside to Atlassian's products is that they are memory **hogs**. Recommended min-spec for small installs of Confluence or JIRA is 4GB RAM... hence cheap VPS.

I also knew I was going to do this on PostgreSQL, not MySQL. When I made this call for the JIRA install before, this was mostly a decision based on Postgres' cool-factor compared to MySQL's tucked-in t-short and big square glasses reputation. This time, having had a play with MySQL as well, I went with Postgres again for the cool, but also because I find its syntax clearer, which is *incredibly* important when I'm working out what I'm doing as I follow other people's instructions. Not to mention, Postgres has a great reputation for reliability, which is meaningful now that I understand a tiny bit better how the DBs work.

Finally, SSL was a must, so I put Nginx into the mix. We don't work with it at the University, but I had used Nginx as a reverse-proxy before for the JIRA thing, and I decided to go with the same again. Nginx's server blocks are almost JSON-esque in format and syntax, which makes them clear for someone whose background is more front-end focused. I think there might have been a trendy factor here too the first time around, but I can't really remember.

In the end we've got:

* 4GB RAM VPS running Ubuntu 16.04.1
* Confluence 6.0.3
* PostgreSQL 9.5.5
* Nginx proxying all the things to Confluence's Tomcat connector
* SSL provided courtesy of [Let's Encrypt](https://letsencrypt.org)

I had considered doing this with Docker too at one point--spinning up images for Confluence and Postgres and even Nginx with [Docker Compose](https://docs.docker.com/compose/), but the climb in was a little too steep for me at this point.

### How

So... there was a lot of copy-paste on this one. And I've got to give credit where it's due--[Digital Ocean](https://www.digitalocean.com/community/tutorials) have some really great guides for setting up a lot of the basics. They make no assumptions about your knowledge (other than understanding how to work in BASH), and the guides are pretty damn comprehensive. My server configs mostly came from there (though because I'm hosting the wiki on a subdomain, I had to do some more work on it--theirs focus on directories).

The reason I'm excited enough to write about this though, was that there was a moment when I started knowing the answers to some of the questions that I was asking myself and google as I went along. I am by no means an Nginx master now, but I can look at a server block and have a good idea of what it's going to do.


### Why

That moment you realize you've developed an understanding is a magical thing--and you know that it's going to snowball. Now I've got one more tool under the belt, and I'll be able to pick up the next one by referring and comparing to what I already know.

The momentum for this project came out of a need to solve a very specific problem that I was experiencing: storing my files and data somewhere accessible. The goal of addressing that need kept me working to learn some really useful skills. Using tools that I thought would make me look like a cool programmer helped with this too--being cool is a goal in and of itself!

The important things I'm taking away are: it's OK to be seduced by what's trendy, and you should never lose sight of the goal. Even if Postgres were a far inferior database, the fact of the matter is that I've learned something about databases that I can reapply elsewhere. Same for Nginx. If the trendiness gets you more excited about doing the thing that you're doing, **embrace it**.

I *will* learn Docker some day--looking at Docker Compose kind of opened my eyes to some really cool DevOps stuff (someone has created a Learning DevOps the Hard Way [trello board](https://trello.com/b/56YzDetY) here, riffing on Zed Shaw's [Learn code the hard way](http://www.learncodethehardway.org) work). And that will be its own project with its own excitement.

Being excited about something makes it go so much easier. Use that fact to your advantage and hide learning hard things inside projects you are excited to do.
