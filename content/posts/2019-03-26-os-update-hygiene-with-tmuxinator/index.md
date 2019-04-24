---
title: OS Update Hygiene with Tmuxinator
layout: post
tags: tmux, tmuxinator, shell, vim, security
category: code
---

In the last year-ish since I switched to exclusively using Vim and Tmux for my dev
environment instead of GUI apps like Sublime, I've noticed that I've developed a
very bad habit of almost never rebooting my machine. The reason is that my usual
Tmux/Vim setup involves several Tmux windows with several panes in specific
configurations for running Vim, the Rails console, the Rails server, a search
engine server, Webpack... a lot. And it's a pain in the butt to set up manually
every time.

<!-- more -->

Like I said, this means I almost never restart the machine, which is bad, for
two big reasons (along with the usual cruft of the machine just starting to get
'weird' sometimes):

- I delay installing OS updates, including security patches
- I rarely take advantage of full-disk encryption because the machine gets left
    hot and unlocked

Neither of these are good. In fact, I'd call them both bad. It's the kind of
stuff that I'd give my parents flack for doing tbh, so... I should probably be
dogfooding.

And it really is just my terminal setup that stands in the way of things for me.
Browsers, the other tool that I'm dependent on, have had pretty solid resume
behavior for a while now.

I recently put a little time into getting a good
[Tmuxinator](https://github.com/tmuxinator/tmuxinator) config set up for myself.
Tmuxinator is a Ruby gem for managing Tmux sessions. You define a session in a
YAML file, and instead of manually spawning all the windows and panes you need,
and the processes or tools that run in each pane (like Vim or the Rails
console), you just run `mux [project-name]` and away it goes.

It's nice because I no longer have to remember to

- be in the right directory when I start a Tmux session--you can define a global
    session root in the YAML config, and then further define per-window roots if
    you want different windows to behave differently. This is nice because I can
    spawn my main working windows in a project folder, an then spawn Vim in my
    Dropbox notes folder
- start a search engine before I start the Rails server--I have these set to
    start together
- remember to run `bundle && yarn` before booting the app. This happens when the
    Tmuxinator project starts (which means it's done once for all windows rather
    than once per window)
- resize my panes to get Vim to the right size

There's some invisible config behind this that I already have set up. I use
[Thoughtbot's dotfiles](https://github.com/thoughtbot/dotfiles) with [my own
customizations](https://github.com/flyinggrizzly/dotfiles-local), which, so long
as I have [`rbenv`](https://github.com/rbenv/rbenv) installed[^1], means I can
just run `rcup` and then whenever I want `mux [project-name]` because I have
Tmuxinator as a default gem.

The nice thing is that I'm far less resistant to rebooting my
machine--Tmuxinator takes care of the pita of getting things ready for work
again. And I'm actually starting to reboot more. Having Tmuxinator prep my
workspace before I start is one less thing I have to trip over when there's a
DB migration or dependency change. Big 👍.

If you want to see my Tmuxinator config, it's
[in my dotfiles](https://github.com/flyinggrizzly/dotfiles-local/blob/master/tmuxinator/ma.yml).

---

[^1]: There is a slight frustrating order dependency--because I have Tmuxinator defined as a default gem for `rbenv`, and carry that definition in my dotfiles extensions, I need to make sure that `rbenv` is installed before I run the dotfiles setup, otherwise `rbenv` and git will complain that there's already an `~/.rbenv` directory when it's just the default gems config. At least it's only an issue when first setting up a computer.
