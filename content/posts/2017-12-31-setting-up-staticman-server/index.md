---
title: Setting up a Staticman server for comments on Jekyll and static sites
layout: post
series: staticman
category: code
tags: jekyll, staticman, static site, static site generator, ssg, dokku, vacation_post
---

I'm running [Staticman](https://staticman.net) for comments on this blog. If you're using the main/public instance of the app, this requires you to add Staticman as a collaborator to your site repo, which I decided I'd rather not do... so I've run up my own instance of the application, and this is a quick look at how I did it.

<!-- more -->

I am not a JS/Node/Express dev, and this post is not about the nitty gritty of how Staticman works. It's more to document the things that caught me out in setting it up, than to provide full guidance. The official docs are pretty good solid, if a little bit cursory. They are much more aimed at JS developers contributing to the codebase than casual users wanting to set up their own instance. If you want to set your own instance though and, like me, are not a JavaScript developer and so are struggling with some of the conventions or ellisions, I'm hoping that this will help!

## Assumptions

There's one big assumption I'm making about setting this up. I'm lazy and cheap AF, so I run most of my apps on [Dokku](http://dokku.viewdocs.io/dokku/), which is effectively a privately hosted Heroku replacement without all the limitations on the free tier. This means I can export a few environment variables, set up a subdomain and certificates, and `git push` my apps into production.

## Kicking the tires locally before deploy

This is probably unnecessary--the app works. But as I was getting ready to push it live, I really wanted to see if I could get it working on my local machine. If you're hosting your site locally for testing with `hugo server` or `jekyll serve` and then run up Staticman locally, you can definitely do it, but you'll still need to follow the [setup and requirement steps](https://github.com/eduardoboucas/staticman#requirements) for Staticman (including creating a GH bot account with a token, and adding it as a collaborator to your repo). Also, don't forget to change your form's endpoint and branch if necessary.

The thing that caught me out here was the presence of the `.env` file in the repo. For me, that was an indicator that the repo was using [dotenv](https://github.com/motdotla/dotenv) (which is the JS equivalent of the Ruby gem of the same name). Turns out it's not... that's there for the Docker stuff. For local development, just follow the instructions and copy `config.sample.json` to `config.development.json` and input your secrets there. Just be sure not to track it into git.

You should also create a new Github user account, just for this application (you could use an existing one, but best to keep things clearly separated). I've created "flyinggrizzly-staticman" so I know exactly what it is. This is the user you should create a Github token for. Hang on to that token, because you'll need it here, and also for actual deployment (you can regenerate in between steps if you want). And do yourself a favor and disable *all* notifications for this user if they're going into your email inbox. You'll be friggin bombarded with PR notification before long otherwise.

{% include callout.html
  heading="If you really want to use environment variables in dev..."
  body="You can add `dotenv` to the dev dependencies in `config.json`, and add 

  ```javascript
  const env = require('dotenv').config()
  ```

   as the top line of `index.js`. Then, in `config.development.json` you can reference those values like 
   
   ```javascript
   \"rsaPrivateKey\": JSON.stringify(process.env.RSA_PRIVATE_KEY),
   ```
   
 I'm not really sure it's worth it... especially since it _doesn't_ create parity between dev and prod. In production, `config.production.json` can be an empty object, and all the config stuff can be supplied through OS level environment variables."
%}

One last thing--the Staticman docs refer to the SSH key and RSA private key interchangably. They expect you to create it using `ssh-keygen` per the Github docs, but the config looks for it under `rsaPrivateKey` in the application, or `RSA_PRIVATE_KEY` in the environment.


## Prep application for deployment

Staticman follows the [12 Factor approach](https://12factor.net/config) to config, and so stores sensitive keys, etc, in the environment.

If you're deploying to a Dokku server, here's the checklist:

- [create the app](http://dokku.viewdocs.io/dokku/deployment/application-deployment/) in Dokku (duhh)
- [set up a subdomain](http://dokku.viewdocs.io/dokku/configuration/domains/) for it (recommended in case people are poking at your form before using it; make it something sensible like `comments.flyinggrizzly.io` in my case)
- set up SSL for it with Dokku's [self-signed/Let's Encrypt cert shuffle]({{ site.baseurl }}{% link _posts/2017-06-09-setting-up-dokku.md %}#ssl)
- [supply all the environment variables](http://dokku.viewdocs.io/dokku/configuration/environment-variables/) (you should supply the RSA key, and Github token, at the very least...)
- push app to production

{% include callout.html
  heading="Deploying things your way"
  body="While I'm focusing specifically on Dokku, I'm going to guess that whatever your deployment process is, the basics of getting sensitive info into environment variables, putting your app on the server, exposing it via subdomain/port/path, and starting it should be something you're able to figure out. If you want more Dokku guidance, check out my [series for setting it up](/2017/06/09/setting-up-dokku/)."
%}

## Hooking up your new instance to your site

When you're ready, you should do these things:

1. invite your new Staticman Github user as a collaborator on your repo
  - do NOT go into that user elsewhere and accept the invite manually
2. programmatically accept that invite by hitting the Staticman API's `connect` endpoint: `https://[your-staticman-url]/v2/connect/[your-main-github-username]/[your-site-repo]`
  - if you see "Invitation not found", either your user isn't set up, in the app (check the token), you haven't invited it to collaborate on the repo, or you already accepted the invite manually (this threw me way off)
3. update your comments form to use the new endpoint
4. post a comment to test!

Ideally, things should be working. If they're not... not sure. I didn't have any problems at this point, but if you run into an issue, [leave a comment](#comment__form) and I'll help if I can.

Now, it's time to party!

![the parrot that parties](/assets/images/post-images/shuffleparrot.gif)