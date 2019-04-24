---
title: Setting up Borg Backup to rsync.net
layout: post
permalink: :year/:month/:day/:title/
categories: code
tags: how-to, infrastructure, backup, does-this-make-me-look-cool
---

For a while here, I've been backing up my [Confluence install](/2017/01/02/learning-by-doing-what-you-want/) to Dropbox using a [nifty little shell-script](https://github.com/andreafabrizi/Dropbox-Uploader) that interfaces with Dropbox's API. That wasn't too bad, all told, for a while. When the wiki was first set up, this was a solid MVP. But then you realize that once the data you need to back up is of sufficient volume, you've pretty much got to choose between versioned backups, or not making your DB account explode.

Solution to this, of course, is to choose the right tool for the job. Dropbox is great, but not so much for backups. In this case, the right tool for the job is [`borgbackup`](http://borgbackup.readthedocs.io/en/stable/index.html).

<!-- more -->

Let's get one thing out of the way first: I *totally* chose the tools I did because I think they're going to make me look cool when I talk to my dev friends, and that's OK, because they're good tools and I learn a lot as I work with them. This is going to be a running theme on this blog.

{% include callout.html 
  heading="New post about using borg"
  body="I've written up [another post](/2017/06/30/backing-up-apps-on-dokku) about using `borg`. Worth taking a look at as I've gotten a tiny bit more comfortable with it. Plus, if you're interested in [Dokku](http://dokku.viewdocs.io/dokku/), it's in there too!"
%}

### Update 2017-01-29

After tweeting this post out, I got a [response](https://twitter.com/ThomasJWaldmann/status/825521946079137792) from [Thomas Waldmann](https://github.com/thomaswaldmann), one of borg's maintainers. Which was unexpected, but thoroughly welcome. He pointed out that Rsync.net also has a borg 1.0.x binary available, you just have to specify it explicitly. I've amended this post according. Thank you Thomas!

{% include image.html
  img="assets/images/post-images/locutus.gif"
  title="Locutus of Borg"
  caption="Seems like the opportune moment for a Locutus gif..."
%}


I came across borg and it's big brother [attic](https://attic-backup.org/) a while back whilst looking at solid versioned and encrypted offsite backup options. I didn't use them at the time, but they seemed like the right option here.

Basically, borg is a fork of attic, that is apparently under more active development. So the interwebs tell me, and therefore this is true. Regardless, borg is definitely being maintained and has some solid docs.

Backup program in hand, we need a destination. In comes [rsync.net](http://www.rsync.net/). This is one of those magical companies that does one thing, and does it well. I bumped into these guys when I was busy trying to look cool by exploring the BSDs. Their entire platform is built on top of [FreeBSD's jails](https://www.freebsd.org/doc/handbook/jails.html) for security, and the [ZFS](https://www.freebsd.org/doc/handbook/zfs.html) for data integrity and versioning.

Their pricing is fair ($0.08/GB), and it's really as simple as setting up a cronjob to rsync a directory over SSH to your rsync server. The ZFS snapshots take care of versioning your backups for you, as well as making sure you don't end up with any [bitrot](https://arstechnica.com/information-technology/2014/01/bitrot-and-atomic-cows-inside-next-gen-filesystems/). On top of that, if sh** goes down they'll ship you a drive with your data. Except... it gets better.

Rsync.net, being built by a bunch of geeks for a bunch of geeks, have a [semi-secret attic/borg pricing tier](http://www.rsync.net/products/attic.html) [^1]. Because borg and attic take care of backup versioning on your local machine before sending them to the server, this saves rsync.net a *ton* of space, and they'll drop the price from $0.08/GB to $0.03/GB (you also don't get the same level of support, so make sure you know what you're doing). I'm pretty sure that this tier is here just to get all the super-nerds hooked on the platform so that they'll talk their bosses into bringing in big-fish contracts (they also have a Petabyte+ customer bounty), but you know what? Who cares! I hope that it works!

### Putting it together

It's shockingly easy to do, actually. This rundown would work on any VPS provider I imagine as well, though you wouldn't have the ZFS bitrot protection or jailing unless it was on a FreeBSD VPS. Just make sure your machine has borg installed and off you go!

1. Install borg on your local machine.
  - It goes by `borgbackup` in most distros I think; other than that I'll let you figure this part out
  - This also works on OS X (`brew cask install borgbackup`), btw (maybe Windows too? No idea)
1. Set up SSH keys to your borg server.
  - If you're using rsync.net, you'll have to use `scp` to do this; the delightful `ssh-copy-id` won't work unfortunately
1. Make sure the server has borg installed.
1. Initialize a borg repo *on the remote, from the local.*
  - `borg init [options] [user]@[server]:path/to/repo #run this on the local machine`
  - You'll be asked for a passphrase for repo encryption here; don't forget to write it down
1. Export that passphrase as an environment variable so you have it for next time/any other repos you create.
  - `export BORG_PASSPHRASE='superawesomepassphrase'`
  - The borg team recommend using single-quotes there because different shells do different things
  - Maybe worth adding that line to your `.bashrc` or similar so it's available everytime you log in
1. Run your first backup with the `borg create` command.
  - Actually, just use a shellscript that you can later set to run on a cronjob--makes it easier to keep all the variables like repo and server logins straight. See the next step...
1. Set a [shellscript](#shellscript) and a cronjob to run this all automatically for you.
  - You should export your passphrase in the shellscript--it will only be visible to your user, and it's needed for this to run

There are a couple of things to be aware of, mostly around the split between the borg 0.x branch and the borg 1.0.x branch. Currently, 1.0.7 is stable and what most of the docs focus on. The two branches are interoperable--I've got 1.0.7 on my local, and rsync.net seems to be running 0.29 by default. The only thing I've encountered that's weird is some extra output while running the command. Borg have been really nice though and put in a note that points out the complaint about arguments can be ignored if it's being caused by 1.0.x interacting with 0.x:

```bash
Please note:
If you see a TypeError complaining about the number of positional arguments
given to open(), you can ignore it if it comes from a borg version < 1.0.7.
This TypeError is a cosmetic side effect of the compatibility code borg
clients >= 1.0.7 have to support older borg servers.
This problem will go away as soon as the server has been upgraded to 1.0.7+.
```

If you see that complaint, it's really easy to take care of--just specify `--remote-path /usr/local/bin/borg1/borg1` in your `borg init` or `borg create` commands, or, even better, `export BORG_REMOTE_PATH=/usr/local/bin/borg1/borg1` (and add that to your `.bashrc`). Obviously this path will depend on where your server is keeping that binary, but you get the gist.

As far as encryption goes, borg gives three options: none (boo), repokey (default), and keyfile. If you're encrypting, it's done with 256-bit AES, so pretty decent. Just be sure your [passphrase is > 12 characters.](https://blog.codinghorror.com/your-password-is-too-damn-short/)

### Shellscript

This is straight from the [borg docs](http://borgbackup.readthedocs.io/en/stable/quickstart.html#automating-backups):

```bash
#!/bin/sh

REPOSITORY=username@remoteserver.com:path/to/repo

export BORG_PASSPHRASE='superawesomepassphrase'
export BORG_REMOTE_PATH=/usr/loca/bin/borg1/borg1

# Backup all of /home and /var/www except a few
# excluded directories
borg create -v --stats                          \
    $REPOSITORY::'{hostname}-{now:%Y-%m-%d}'    \
    /home                                       \
    /var/www                                    \
    --exclude '/home/Ben/.cache'                \
    --exclude /home/Ben/Music/Justin\ Bieber    \
    --exclude '*.pyc'

# Use the `prune` subcommand to maintain 7 daily, 4 weekly and 6 monthly
# archives of THIS machine. The '{hostname}-' prefix is very important to
# limit prune's operation to this machine's archives and not apply to
# other machine's archives also.
borg prune -v --list $REPOSITORY --prefix '{hostname}-' \
    --keep-daily=7 --keep-weekly=4 --keep-monthly=6
```

Someone just asked me a [good question](https://twitter.com/howardm19/status/957488476177424384) on Twitter the other day about the `{hostname}` call in the script, and I figure it's worth noting that that is entirely optional. All that does is drop into the repository name your machine's hostname. This is useful if you're backing up multiple servers to one [rsync.net](https://rsync.net) repo, but probably less so if you've only got one server. You could just as well replace that with a hardcoded string, like the name of the app being backed up if you have several apps backing up from one machine.

The `{now:%Y-%m-%d}` call is also technically optional, but would be harder to do without. The [docs on the borg create](https://borgbackup.readthedocs.io/en/stable/usage/create.html) command note that the name supplied must be a valid directory name, which I assume means it must be unique, in addition to not containing characters like ':'. Having a date string in the directory name is decent way of achieving that.

### Wrapup

I found this process a lot easier than I anticipated. I had expected to be wrestling with the docs both for rsync.net and borg, but in the end, borg backup's quickstart docs were all I needed.

Borg also offers a few compression options--at some point I want to look into these, as well as run a firedrill for recovering data from a borg repo. But for now, I'm very happy with my backups!

---

[^1]: In fact, I'm pretty sure that this is how I found out about borg and attic in the first place.
