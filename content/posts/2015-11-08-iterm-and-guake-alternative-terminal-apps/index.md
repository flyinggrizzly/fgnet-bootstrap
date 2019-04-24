---
title: iTerm and Guake Alternative Terminal Apps
layout: post
permalink: :year/:month/:day/:title/
category: tools
tags: terminal linux macos mac command-line developer productivity 
---

[iTerm](https://www.iterm2.com/) and [Guake](https://github.com/Guake/guake) are terminal replacement apps for Mac OS X and Linux (Gnome) respectively, that offer a few simple, but absolutely game-changing tweaks over 'standard' terminals.

<!-- more -->

I call myself a productivity *junky* because I have an unshakeable belief that there is always a better way to do things. And I will compulsively seek it out.

The search for faster and more efficient tools seems to be a black-hole of time for me. Whether that is ironic and/or a problem is usually determined by how much the search is distracting me from the work I am trying to streamline...

In retrospect however, the time it took me to discover iTerm and Guake is time very well spent. These two apps have become central to my work on my computers, whether I am doing dev-work or not.

### Why iTerm and Guake

The key feature that has me sold on them is simple: a hotkey combo that causes a terminal 'visor' to drop down over the top of my screen:

![iTerm and Guake's drop-down terminals](/assets/images/post-images/2015-11-08-iterm-and-guake-alternative-terminal-apps-1.jpg)

This means that I can get in and out of the terminal without interrupting my screen layout. Most of my work is done outside of the terminal,
but I still use it frequently. I don't, however, want to sacrifice screen real-estate to it (as you can tell from the screenshot, my multi-pane [Atom](https://atom.io) setup takes over most of my 15" Mac screen as it is!).

iTerm allows me to quickly open the terminal, fire off my command, and even see it take effect while I run it because of the transparent window iTerm (and Guake) use. It's non-intruseive and great.

One of the other great features of these two apps is tabbed operation in the Terminal. While this is a default option in most Linux terminal apps, it is not the case in Apple's Terminal.app. Using iTerm you can run multiple processes, in multiple directories simultaneously without having to manage a ton of terminal windows. It's the kind of innovation we saw *ages* ago in web-browsers. Nice to have it here too. (One minor frustration with Guake here: while Mac OS X allows multiple root installation processes, Ubuntu-based Linux still locks down the system while `apt` packages are being installed, which somewhat limits the benefit of tabbed terminal operations if you're impatient like me).

Between the visor mode (godly), and the tabs (also, godly), I've switched whole-sale over to these two terminal replacements.

They both offer an extensive list of additional features, many of which I am still discovering:

#### iTerm2
* Split-panes
* Search through the terminal
* Autocomplete
* Quite a few more as well!

#### Guake
* Colored syntax and file highlighting
* Quick open by clicking on filenames in the terminal window
* Also, more.

### How to install

**iTerm2** can be installed in a couple of ways. If you are using [Homebrew](http://brew.sh/) and [Caskroom](http://caskroom.io/), just run `brew cask install iterm2`, and it will download the app package to your Cask directory. You can also download the .app package directly from their [website.](https://www.iterm2.com/downloads.html)

For **Guake,** installation instructions can be found on their [GitHub page](https://github.com/Guake/guake/#installation). If you prefer to use PPAs and are running Ubuntu or Mint, the most up-to-date version of Guake is available via a third party. Run the following commands to add the repo, update **apt,** and install Guake:

* `$ sudo add-apt-repository ppa:webupd8team/unstable`

* `$ sudo apt-get update`

* `$ sudo apt-get install guake`

(Should you wish to uninstall, run `sudo apt-get remove guake`, and optionally use **ppa-purge:** `sudo ppa-purge ppa:webupd8team/unstable` to remove the repo and safely downgrade any other packages that have used it as a dependency. If you need to install **ppa-purge** this can be done with `sudo apt-get install ppa-purge` from the main Ubuntu repos).
