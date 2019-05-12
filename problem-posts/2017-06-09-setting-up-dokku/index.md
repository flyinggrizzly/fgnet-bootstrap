---
title: "Dokku: Setting up Dokku"
layout: post
permalink: :year/:month/:day/:title/
tags: dokku, borg, url grey, ops, vacation_post
categories: code
series: dokku-automated-deployment
---

Heya. I [posted last week]({{ site.baseurl }}{% link _posts/2017-05-31-writing-a-url-shortener.md %}) about building **[Url Grey](https://github.com/flyinggrizzly/url-grey)**, my URL shortener, a process which lead me to discovering and setting up some new tools. Specifically, [Dokku](http://dokku.viewdocs.io/dokku), [Codeship](https://codeship.com) for Continuous integration and delivery, and [Code Climate](https://codeclimate.com) and [Hakiri](https://hakiri.io) for code security, style, and test coverage reporting. I've decided to write the whole process up more completely, in part for myself, and in part because there a few hiccoughs I ran into that didn't have answers (or readily apparent answers--it took me some hunting and piecing together of things) online. 

This will be part of a series (hello slug up above![^1]), starting with setting up Dokku, and moving on through the process of linking all the pieces together to get a continuous deployment setup.

<!-- more -->

## Getting started

Setting up Dokku is probably the easiest part of this whole process, especially if you're just coming to it now. The tool has been undergoing pretty serious development (and their docs are littered with notes like "available in version .40 and later"--as of writing, current version is 0.9.x), and they've been adding a lot of great features and plugins.

Everything in Dokku is a [Docker container](https://www.docker.com/what-container). Creating new apps in Dokku actually creates new machines, one per app, and one per database needed by any apps. It's kind of a genius use of Docker, and takes all the management out of it. If for nothing else, the Dokku team should get serious credit for this design (and they deserve credit for a fair bit more).

## Setting up the Dokku server

If you want to follow along at home, you'll need a fresh Linux box of some description (a VPS or a Vagrant machine will both suffice) with at least 1GB RAM. Recommend the Debian family (and let's be honest, probably Ubuntu), as there are some extra hiccoughs in Arch (and weirdly CentOS) as well as the more esoteric Linuxes[^2] that we won't get into. This machine should be brand spanking new--the only commands I'd run before the get go would be `apt update`. After that, use [Dokku's docs](http://dokku.viewdocs.io/dokku/getting-started/installation/#1-install-dokku) to get you going. Come check back in once you've entered your public SSH key into the (temporary) web interface. Word to the wise--if you're doing this with their bootstrapping script, *run this as the root user.* It creates a user, `dokku`, as well as a fair few other things that require root access.

One thing to note: the web interface for SSH keys gives you a choice between serving applications on ports, or at subdomains (I don't think that the microcopy on the interface is 100% clear). If this is happening on a real live server, the subdomain option requires a DNS provider that supports wildcard sub-domain A-records (and ideally, wildcard sub-sub-domains, like `*.dev`). If you're doing this locally on Vagrant, or your DNS provider doesn't do that, best to go with the ports option.

##### Ideal domain config for a live server

| Record type    | Value      | Destination                  |
|---             |---         |---                           |
| A record       | `dev`      | [ip address of dokku server] |
| A record       | `*.dev`    | [ip address of dokku server] |

If you are doing this on a server, now would be a good time to point your subdomains at your Dokku server's IP address. I'd recommend pointing both `dev` and `*.dev` at it, so you can ssh to [username]@dev.domain.tld, and hit apps at [app-name].dev.domain.tld as above.

Assuming things have all gone to plan, you should now have a Dokku server available via SSH. And that's literally it. Stupid easy to set up.

## Deploying apps

One of the ways in which Dokku shows its relative youth against, say, Heroku, is the way in which you set up applications. Whereas with Heroku you do most everything via the CLI, with Dokku you need to actually access the server via SSH to create applications. Again, the Dokku docs on [app creation and deployment are nice and clear](http://dokku.viewdocs.io/dokku/deployment/application-deployment/), so I'll just highlight the minor gotcha:

**On the Dokku server**
```bash
$ ssh user@dev.domain.tld
$ user@dev.domain.tld $ dokku apps:create app_name
```

This creates a folder `app_name` in the home folder of the `dokku` user, and initializes a git repository for you to push to. Now, back on your local dev machine...

**On your local machine**
```bash
$ git remote add dokku dokku@dev.domain.tld:app_name
$ git push dokku
```

And again, that's... pretty much it. From here on our, your apps are a hop, skip, and a `git push` away.

### Databases

I think I've mentioned [Dokku's plugins](http://dokku.viewdocs.io/dokku/community/plugins/) already, but they're pretty sweet. The [Postgres plugin](https://github.com/dokku/dokku-postgres) in particular is useful. Again, this is covered well in their docs, but here's how you set up a Postgres container on Dokku for an app:

**On the Dokku server**
```bash
$ sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git     # plugins have to be installed by the root user
$ dokku postgres:create database_name                                       # creates the database container
$ dokku postgres:link database_name app_name                                # link the app to the database
```

You still need to set up `config/database.yml` in your application (or the equivalent), and if you're following the strategy of exporting your database credentials as environment variables for safety, do the following as well:

**On the Dokku server**
```bash
$ dokku config:set app_name KEY=VALUE KEY2=VALUE2
```

*[Full docs for Dokku environment variables](http://dokku.viewdocs.io/dokku/configuration/environment-variables/).*

It's useful to do this before you get around to deploying the app, because if you do it later, you'll end up having to drop or reset the database unecessarily.

### Post build tasks

Any tasks that you would normally run after building/deploying your app, like database migrations, should now be run **on the Dokku server.** This can also be automated with [deployment tasks in an `app.json` file included with your project](http://dokku.viewdocs.io/dokku/advanced-usage/deployment-tasks/).

```bash
$ ssh [username]@dokku.tld
dokku $ dokku run app_name bundle exec rake db:migrate
```

## Deploying the same app more than once

Where things a slightly less clear than above is if you want to deploy the app twice, say, in staging and production environments. All you need to do is repeat the above steps, changing `app_name` and `database_name` when creating the app on the Dokku server. To create the remote, just add another origin locally: 

```
git remote add dokku-staging dokku@dev.dokku.tld:app_name_staging
```

This will get more complicated once we get to automated deployment though, but only slightly, and because it's one of those bits of git-fu that are rarely used.

{% include callout.html
  heading="Git remotes and Dokku apps"
  body="
Dokku defaults to deploying apps from the remote's `master` branch. It accepts pushes to other branches, but it won't do anything. (This [can be configured](http://dokku.viewdocs.io/dokku/deployment/application-deployment/#deploying-non-master-branch), but it seems simpler to not fuss with the extra environment configuration). This is important regardless of whether your app is deployed once or 10 times--if you are using a branch name other than `master`, you need to specify that you are pushing to the Dokku remote's master branch from your local `testing`/`production`/`staging`/`awesome-branch`: 

```bash
git push dokku local-branch:master
```

instead of just `git push dokku`"
%}

## Deploying an app at its own domain

If you want to deploy an app at a domain other than `app_name.dev.dokku.tld`, it's pretty simple. Run the following on the Dokku server:

**On the Dokku server**
```bash
dokku domains:add app_name awesome.app.tld
```

## SSL

The most complicated part of deploying an app to Dokku was setting up SSL certs. I actually started making noise in the Dokku Slack channel about an issue with accessing the app after it was deployed before I realized I was hitting an SSL issue. The apps are deployed without SSL by default, but if you're deploying a Rails app, it's in the `production` environment. Which means, that unless you've disabled the default `config.force_ssl = true` line in `environments/production.rb`, the app *will not* serve, because it's insisting on HSTS and can't be satisfied. (The last entry (at time of writing) on the [Dokku troubleshooting page](http://dokku.viewdocs.io/dokku/getting-started/troubleshooting/) is there because of this). If you glance quickly, this sounds like some of the other issues further up the page, but it's not--it's not a problem with Dokku at all, actually, though will probably be hit quite frequently.

Dokku can generate self-signed certificates on its own, or use a [Let's Encrypt plugin](https://github.com/dokku/dokku-letsencrypt) to go legit. If you use the latter, you end up using the former to bootstrap it anyways. The Let's Encrypt app requires that the app be accessible, so if you do have a setting forcing SSL, you can either disable it and redeploy, or use a self-signed cert temporarily. As usual, the following is cribbed straight from [Dokku's documentation on SSL](http://dokku.viewdocs.io/dokku/configuration/ssl/).

If you're temporarily disabling the forced SSL in the app, do so, and push up to your Dokku instance, and [skip to the Let's Encrypt bits below](#ssl-with-lets-encrypt). 

Otherwise, let's do the self-signed cert thing:

**On the Dokku server**
```bash
$ dokku certs:generate app_name app_name.dev.dokku.tld
```
It's going to ask you a bunch of questions, which let's be honest we're going to ignore--because we're about to replace this self-signed cert with a legit one.

The docs also offer a `certs:add` command, which we don't need here bcecause the `certs:create` does that automatically. The `add` command is only for CA issued certs that have been uploaded.

### SSL with Let's Encrypt

This is about as easy as above, but again, requires that the app be accessible via the web for the Let's Encrypt CA to verify you are who you say you are. There is also one setup step that needs to be done first.

**On the Dokku server**
```bash
# Set your email for the LE CA. The --no-restart flag just saves you time, as ENV changes generally cause apps to reboot
$ dokku config:set --no-restart myapp DOKKU_LETSENCRYPT_EMAIL=your@email.tld 
$ sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
$ dokku letsencrypt app_name
```

This will run a bunch of stuff. If you see something about the app likely being rejected, I've found, after two deployments, that it's a red herring--the certification application has been accepted both times.

If you want to set up automated renewals, there are a couple more things to do, though I deviate from the Dokku/Let's Encrypt plugin docs here because cron is finicky.

To enable auto-renewals for an app, run:

**On the Dokku server**
```bash
$ dokku letsencrypt:auto-renew app_name
```

The docs say to use a built-in command to set up a cronjob for this to be run daily, but I'm not a fan of this, because that just bodges the following at the *very bottom*[^3] of the `dokku` user's crontab: `@daily /var/lib/dokku/plugins/available/letsencrypt/cron-job`. Because I use the `dokku` user's crontab to dump my Postgres databases nightly, I manually set the job up to run at a specific time:

**dokku user's crontab**
```
53 01 * * * /var/lib/dokku/plugins/available/letsencrypt/cron-job
```

The addition of the Let's Encrypt SSL certs should kick in pretty much immediately, so your app should be available without browser warnings now. (But if you are using a database, [don't forget to run migrations](#post-build-tasks).)

{% include callout.html
  heading="Don't forget to enable your firewall"
  body="At this point you should be ready to enable your firewall. If you're using Ubuntu, Digital Ocean has a solid [guide on setting up UFW](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-16-04). And, it should go without saying, but you should make sure you allow SSH connections in your firewall, so that your pushes to the Dokku remote can still get through, as well as your config commands. (Also, y'know, allow ports 80 and 443)."
%}

## Wrap up

That just about covers the basics of setting up and deploying to a Dokku server as I did it. I'm hoping that that's useful.

If you run into any problems I haven't covered here, check out the [Dokku troubleshooting docs](http://dokku.viewdocs.io/dokku/getting-started/troubleshooting/). There are a few on there that I didn't run into, but that could vary depending on the Linux and server provider you are using.

I'll be following this up with posts on **automated builds and tests for [Url Grey](https://github.com/flyinggrizzly/url-grey)**, as well as one on **automated deployments to Dokku**, and my **backup strategy for Dokku.** See you around!

## Update 2017-06-13

Added callout about enabling firewall.

---

[^1]: That little Jekyll snippet probably merit its own post at some point too--that's automatically generated based a `_data/series.yml` file
[^2]: Linuces?
[^3]: [You need a blank line at the bottom of your crontab (see first answer).](https://serverfault.com/questions/680089/cron-job-occasionally-not-running)
