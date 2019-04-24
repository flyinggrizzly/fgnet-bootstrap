---
title: "Dokku: Backing up apps on Dokku"
layout: post
permalink: :year/:month/:day/:title/
series: dokku-automated-deployment
categories: code
tags: borg, rsync.net, dokku, backup, postgres, postgresql, cron, ops, vacation_post
---

Previously in the series, I've focused on setting up and using [Dokku](http://dokku.viewdocs.io/dokku/). This post is less Dokku focused, and more on making sure that you keep all the precious data you generate and collect with the apps on it safe.

<!-- more -->

## What's this all about?

If you haven't heard of it before, `borg` is a tool that creates encrypted, versioned backups of a directory or directories on your machine. It also has the ability to push these backups to a remote `borg` repository for safekeeping. It works a lot like git: each snapshot is analogous to a commit, which can be pushed to the remote.

If you're familiar with git, `borg` should be easy to get your head around.

[rsync.net](https://rsync.net) is a lovely service that provides a [ZFS](https://wiki.freebsd.org/ZFS) filesystem on a [jailed](https://wiki.freebsd.org/Jails) shared [FreeBSD](https://www.freebsd.org/) server. They offer redundant, secure filesystems for not a lot of money. They're great.

Like the first time I set this up, it hinges on a few things:

1. An [rsync.net](https://rsync.net) account to use as a borg remote
2. SSH keys for your `dokku` user on your Dokku server on your rsync.net remote
3. Setting up a couple of folders in your `dokku` user's home directory
4. cron
5. a couple of shell scripts to keep your crontab clean

I'm going to skip past the account set up on [rsync.net](https://rsync.net), because a) I don't want to teach anyone how to suck eggs, and b) I've already talked about it in my last `borg`/rsync.net post (see the [first post](/2017/01/29/setting-up-borg) for a link for some sweet pricing on [rsync.net](https://rsync.net)). That said, I nearly screwed my other server's backups when adding the Dokku SSH keys to [rsync.net](https://rsync.net). If these aren't the first keys you're adding, you've got to be careful, so let's jump in there.

{% include callout.html
  heading="More on Borg and RSync.net"
  body="
This is the second post I've written about using `borg` and [rsync.net](https://rsync.net). If you're looking for more, checkout [my first post about it](/2017/01/29/setting-up-borg)."
%}

## Adding additional SSH keys to an rsync.net remote

Once you've initialized the repo for borg on [rsync.net](https://rsync.net), you need to add keys for the `dokku` user to the remote. If you're skimming [rsync.net](https://rsync.net)'s docs, it's easy to miss the fact that their instructions for adding keys are for the *first* set of keys you add, unless you scroll a bit further. **Don't** overwrite your existing keys. They're important!

To add additional keys, follow [their instructions](http://www.rsync.net/resources/howto/ssh_keys.html), making sure you get down the the "Multiple Keys" section. TL;DR, you add additional keys like so:

```bash
cat ~/.ssh/second_key.pub | ssh [user-number]@[server-id].rsync.net 'dd of=.ssh/authorized_keys oflag=append conv=notrunc'
```

If you're running this from your Dokku server, be sure you're catting out the `dokku` user's key. Probably best to `sudo su dokku && cd /home/dokku` first. You'll be prompted for your [rsync.net](https://rsync.net) password, and then you'll have **appended** your new key. Phew.

If for whatever reason you can't run the ssh commands as the user to which the keys belong, maybe get them off of the server and onto your own machine, and then just amend the path to the file: `cat /path/to/key.pub | ssh ...`

It's not imperative that you set up the keys for the `dokku` user, but it does make file permissions a lot easier later on, because you won't have to transfer ownership of the files you're backing up to a different user, or run any jobs as root.

## Dokku user home folders

I have a couple of extra folders in my `dokku` user's home directory: `scripts/`, `backup/`, and `backup/logs/`.

It's worth noting that this means you can never deploy apps with the names "backup" or "scripts", because Dokku stores the files for each app in a directory with its name in the home directory. I'm OK with this, but you may need to adjust your folder names or structures accordingly. You could probably put the `scripts/` directory inside of the `backup/` dir if you wanted.

That's it. We'll put stuff in them soon. Next!


## Cron

So I said I run all of this with `cron` in the `dokku` user's crontab. Here is that crontab:

```bash
MAILTO='your@email.tld'
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash

# m h  dom mon dow   command

# Renew Let's Encrypt certificates. They must have been enabled with dokku letsencrypt:autorenew [app-name]
53 01 * * * /var/lib/dokku/plugins/available/letsencrypt/cron-job

# Dump the Dokku app database
42 03 * * * /home/dokku/scripts/app-db-dump.sh >> /home/dokku/backup/logs/app-db-dump.log

# Borg the Url Grey DB dump to RSync.net
23 04 * * * /home/dokku/scripts/borg-app-db.sh >> /home/dokku/backup/logs/app-db-borg.log

#### Don't create entries below here, and don't remove the whitespace below thise line!!! ####


```

We're going to ignore the Let's Encrypt auto-renew entry for now, and focus on the two backup entries.

My apps are running against Postgres databases, so the first cron entry runs a script that tells Postgres to dump everything, and logs the job's outputs.

The second one similarly runs a script that makes a borg commit and pushes it to my [rsync.net](https://rsync.net) remote.

The timings are important too--Postgres is good, but you don't want to be running these jobs when your app is under heavy traffic.

## Scripts

### Postgres Dump script

This one is pretty simple. Use the Dokku command interface to issue an export command to your Postgres container:

```bash
#!/bin/bash
dokku postgres:export url-grey-db > /home/dokku/backup/url-grey-db/url-grey-db-$(date +"%Y-%m-%d").dump
```

The Dokku [Postgres plugin](https://github.com/dokku/dokku-postgres) has the `postgres:export [database-name]` command that effectively runs `pg_dumpall` for you, and drops the dump wherever you tell it to.

If you're paying attention, you'll notice that I'm making new backups each night, not overwriting the old one. This is fine for me because the next script, the `borg` one, will only allow the `borg` remote to keep 7 days worth of backups.

It does mean that I'm in danger of filling up my local server though, and it is something I will be addressing in the future... it's just not my most pressing concern at the moment since the database tables are *tiny* right now.

### Borging the Postgres dumps off to rsync.net

This one is a little more complicated, but I've already gone through it in my [previous `borg` post]({{ site.baseurl }}{% link _posts/2017-01-29-setting-up-borg.md %}), and the [`borg` docs](https://borgbackup.readthedocs.io/en/stable/quickstart.html#automating-backups) cover it pretty well too. 

```bash
#!/bin/sh
REPOSITORY=[rsync-id]@[rsync-server].rsync.net:/data1/home/[rsync-id]/borg-backups/borg1/remote-app-borg-repo

export BORG_REMOTE_PATH=/usr/local/bin/borg1/borg1
export BORG_PASSPHRASE='your_secure_passphrase'

# Stamp the logs
echo "\n===$('date')==="

# Backup all of /home and /var/www except a few
# excluded directories
borg create                                     \
    -v --stats                                  \
    $REPOSITORY::'{hostname}-{now:%Y-%m-%d}'    \
    /home/dokku/backup/app-db-dump-dir/         \
    --exclude '*.pyc'

# Use the `prune` subcommand to maintain 7 daily, 4 weekly and 6 monthly
# archives of THIS machine. The '{hostname}-' prefix is very important to
# limit prune's operation to this machine's archives and not apply to
# other machine's archives also.
borg prune -v --list $REPOSITORY --prefix '{hostname}-' \
    --keep-daily=7 --keep-weekly=4 --keep-monthly=6

```

The rundown on this guy is that you:

1. tell `borg` which version of itself to use *on the remote*
2. create your backup (think of this as creating a commit in git)
  - this also pushes the commit to the remote
3. allow `borg` to clean up the remote--you don't need daily backups going back forever

At which point... you're done! Assuming you've named these something sensible and added them to the `dokku` user's crontab, they should start firing straight away!.

Just don't forget to `chmod +x script.sh` on the files...

## Gotchas

There are a couple of things I ran into that influenced the current setup, most of them around file permissions (UGH).

Mostly, the problem is that unless you're running cronjobs as root, which you shouldn't, putting files in different places is just a pain. The solution to this was to just put the `backup/` and `scripts/` directories in the `dokku` user's homefolder.

The other big one, which I've already noted, was almost overwriting my other SSH keys on the [rsync.net](https://rsync.net) remote. Don't do that. Seriously. Don't.

As always, I'd love to hear from you guys!
