---
title: "Dokku: Automated deployment to Dokku"
layout: post
permalink: :year/:month/:day/:title/
series: dokku-automated-deployment
categories: code
tags: dokku, codeship, ci, hakiri, continuous deployment, automated deployment, codeclimate, ops, vacation_post
---

In the first two posts of the series, I looked at [setting up Dokku]({{ site.baseurl }}{% link _posts/2017-06-09-setting-up-dokku.md %}) and setting up [automated builds and testing with Codeship, Code Climate, and Hakiri]({{ site.baseurl }}{% link _posts/2017-06-16-automated-build-testing.md %}). This one ties those two together and covers the process I'm using for automated deployments with Dokku and Codeship (and the gotchas I hit along the way).

<!-- more -->

A lot of this hinges on the fact that Codeship automatically reads your repository's branches, and these can be used to build and deploy different environments. The [Url Grey repo](https://github.com/flyinggrizzly/url-grey) has two main branches: `production` and `staging`, and these represent the two main deployment pipelines I've created for the app in Codeship.

I'm assuming that you've already got testing and build instructions set up in Codeship. If not, check out the [second post]({{ site.baseurl }}{% link _posts/2017-06-16-automated-build-testing.md %}) in the series to get an idea of what that would look like. That test setup will run *every* time you push to your repo, regardless of branch (which is great for making sure PRs are OK for merging). Your deployment actions happen after that on any branch you specify.

To get this set up, go to your project's settings in Codeship:

{% include image.html
  img="assets/images/post-images/codeship-deployment-pipeline-creation.png"
  title="Codeship's project deployment pipeline screen"
  caption="You can set as many of these as you need."
%}

Once you've set that, you'll see something a little more like this, just without the **Custom Script** at the top:

{% include image.html
  img="assets/images/post-images/codeship-deployment-settings.png"
  title="Codeship's deployment pipeline settings"
  caption="It's a little grey, but above the script you can see this is for my production environment."
%}

Here, you can set as many deployments with as many services as you need. For Dokku, we're just going to create a Custom Script deployment.

Once you've selected that, you'll get a bash-styled script editor (again, if you've been following from the last post).

{% include image.html
  img="assets/images/post-images/codeship-custom-deployment-script.png"
  title="Codeship deployment script editor"
  caption="This can be exactly what you want, and will pull environment variables from Codeship's Environment settings as well."
%}

My script reads as follows:

```bash
#!/bin/sh

# Pull the latest code, in full
git fetch --unshallow || true
git fetch origin "+refs/heads/*:refs/remotes/origin/*"

# Set the dokku remote
git remote add dokku-production dokku@dev.grz.li:url-grey

# Push the app live
git push dokku-production production:master
```

This script is complete, but it's not going to work just yet. First we need to... 

### Add Codeships public SSH key to the Dokku remote

You'll need to do this for every application you're deploying with Codeship, because the key is different for each one (though if you're deploying the same app multiple times, you only need one key for the bunch because Codeship treats these as different pipelines).

You can get the key from the **General** section of the Codeship project's settings. Copy it into a file on your local machine, say `codeship.pub`, and then...

**On your local machine**
```bash
cat codeship.pub | ssh root@dokku.tld ssh-keys:add [key name]
```

The key name needs to be unique, so maybe `codeship_app_name` would work well.

With that in place, Codeship should be ready to go. You can test by pushing a commit to the branch you set up the deployment pipeline for and watch it go. Any failures in deployment will appear as a failed Codeship build, and will be angry red in the Dashboard.

You can also check [Dokku's SSH docs](http://dokku.viewdocs.io/dokku/deployment/user-management/#adding-ssh-keys) if you need more info.

## Gotchas

Two big ones:

- Pushing to Dokku from non-master branches
- Deployment tasks

Both are pretty easy fixes, though which is good. 

### Deploying from non-master branches

For the non-master branch thing, if you look at the deployment script I'm using above, that last `git push` line is explicit about its branches:

```bash
git push dokku-production production:master
```

It's that last bit that's important. It tells git that even though we're working in the `production` branch right now, we need to push to the remote's `master` branch. This is because Dokku only builds from the `master` branch (though it looks like this can be [configured with environment variables](http://dokku.viewdocs.io/dokku/deployment/application-deployment/#deploying-non-master-branch)).

### Deployment tasks

The tricky thing here is that if you want to run tasks on the Dokku apps (like db migrations), you'd have to use `ssh -t` to do so, but you'd still be prompted for a password to access the `dokku` user's binaries on the remote. And you could probably mess around with `expect` in the custom script, and load the right passwords into environment variables in Codeship, but

- a: that feels less secure
- b: it sounds like a pain

The good news is that Dokku supports an `app.json` file, much like Heroku. You can load any post- or pre-deplyment tasks into here and Dokku will run them as the `dokku` user. No passwords, no environment variables. Hurray!

```json
{
  "scripts": {
    "dokku": {
      "predeploy": "bundle exec rake db:migrate"
    }
  }
}
```

The difference between pre- and post-deployment tasks wasn't clear to me at first, but a quick test revealed: both run *after* app compilation, but pre-deployment runs *before* the current build is replaced by the new one, and the post-deployment runs *after* the app is replaced. So a database migration should be a predeployment task.

If you want to see more about deployment tasks, check [Dokku's docs](http://dokku.viewdocs.io/dokku/advanced-usage/deployment-tasks/).

And that about wraps up the automated deployment stuff. Once the other stuff is in place, it's all a lot easier. Thankfully! See you next time for the back up post!
