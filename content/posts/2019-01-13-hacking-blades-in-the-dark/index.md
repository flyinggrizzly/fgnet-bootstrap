---
layout: post
title: Hacking Blades in the Dark
categories: tabletop, games
tags: forged in the dark, blades in the dark, against the titans of war, design
---

Wow... it has been a really _long_ time since I've posted anything on here. Last
one was... `*checks notes*`, a post about making OSS PRs (which helped me get a
new job, so that's alright I guess).

For the last... I dunno, 10 months, I've been working on a couple of hacks of
[_Blades in the Dark_](https://bladesinthedark.com/). One is about kids doing
cool kid stuff, like in _Hook_ or _The Goonies_ and _ET_. The other... is kind
of a game where you make _Mobile Suit Zeta Gundam._ So basically giant robots
and political space opera and bad actors all around. (It's called _Against the
Titans of War_ and is [on this site](https://grz.li/titans))

<!-- more -->

It's gone through a couple of revisions, and just the other day I did a slightly
more sane version of `$ rm -rf .` in the repo, and threw a ton of it away. I'd
been working on a lot of the subsystems in the game in the back of my head, and
after a couple of months of feeling stuck and frustrated with it, things had
started to move.

So far, the biggest things I've been working on are the character action verbs,
and the faction game.

## Characters

If you haven't played _Blades_ before, each character has 3 **attributes**, each
of which has 4 **actions**. Whenever you want to do something, you say what you
want, and what **action** you're using to get it, then roll as many dice as you
have 'dots' (marks on your sheet) in that action, and take the highest result.

If something bad happens to you, you can resist it, and you would roll an
appropriate **attribute**. For attributes, you roll as many dice as you have
actions with any number of dots in them. As an example, **skirmish** and
**finesse** are both actions in the **prowess** attribute. If you were trying to
resist being pushed over, you would roll a prowess of 2, since you have 2
actions in that attribute (it doesn't matter how many marks an action has--it
only counts for that attribute roll once).

This part is pretty straightforward--there's a lot of 'poetry' in choosing the
actions you have, since they color the kind of story people tell, and indicate
what is possible to do in the game.

In _Blades_, the attributes each have 4 actions. In my game, they have 3, and
one **veteran adjective**. I wanted characters to feel less powerful in this
game, and reducing the number of actions available means resisting has a lower
ceiling--it's harder with fewer dice available.

The **veteran adjectives** are more than just that though--they indicate that
your character has been around. You get them when you mark certain **trauma**.
It's a razor edge that you have to walk. The adjectives are helpful, but having
them is _dangerous_ since characters have to retire (or worse) when they mark a
4th trauma. Once you have it though... you get an extra die in that attribute to
resist, and you can also add a die to any roll where the adjective is
applicable. Trying to evade a pursuer? If you're **canny**, take an extra die.

## Faction game

This has been a lot harder. One of the coolest thing about _Blades_ is that in
addition to creating a character, all the players as a group create a gang--a
shared character in the story, that they all care about. It is so much fun to
grow your criminal organization in _Blades_, and it's a very good solution to
the problem of a character group where they're all the heroes in their own story
but have no reason to talk to another.

For _Titans_, I wanted to dive into the ugly politics and wrangling you seen in
_Zeta Gundam_ and _Gundam ZZ_--having to ally with arms manufacturers, and
heavily militarized invaders to fight fascists, and wondering when you might be
betrayed... and never noticing exactly at which point you ended up selling your
own soul just to win.

It all sounds great, but it's hard to make a _game_ out of this.

I ended up solving this (I hope at least) by involving the players again in the
faction phase, which in _Blades_ is mostly GM only. In addition to playing a
Soldier on the ground, each player also is in charge of one of the sponsor
factions of your Resistance group, and each faction has its own motives for
fighting back. They might have altruistic intentions to some extent, but that
arms manufacturer that's sponsoring you and providing you with state of the art
mechs absolutely has ulterior motives too.

The trick (again, I hope), was to put the characters at the faction level
against the characters at the squad level--any time one of the Soldiers thinks
that something happening in tactical is bad news, they can take **Contempt** (a
mechanic lovingly stolen from [_The Quiet Year_](https://buriedwithoutceremony.com/the-quiet-year/)
by [Avery Alder](https://twitter.com/dreamaskew)).

A Soldier can use **Contempt** to help out in a lot of situations--avoid taking
harm, turn a failed action into a success, even interfere with another Soldier's
action if the divide is growing deeper and more profound... or just mark XP and
learn more about the world.

Thing is... as useful as **Contempt** is, spend it enough and it throws your
Resistance into crisis as tensions mount. The Enemy attacks immediately, one of
your sponsors betrays you... things get bad. And each time you go into crisis,
the worse it's likely to be the next time.

I really like the idea that the bad command decisions flow down through the
soldiers, and eventually disrupt the entire organization. I'm hoping that this
mechanic ends up being an interesting and fun representation of how communities
work, and how easy it is to destroy one (again... we'll see once it gets to
playtest).

## More general thoughts...

It'd be really easy and cheap-pithy to say game design is just about identifying
the narratives and stories you're interested in, and making those into systems
that players can push and pull against. It's true, but... well... shit's a lot
harder than that.

It's also a lot of staring at blank paper, or distracting yourself with anime,
or seeing someone else's [excellent design and despairing of
envy](https://tinyrul.com/beamsaber) (to be fair, I'm really excited to be
playing _Beam Saber_ and running it for my friends at [Mobile Suit
Breakdown](https://gundampodcast.com) as part of their
[Patreon](https://gundampodcast.com/patreon) -- it's a very cool game, and
playing it has helped me identify what I want to focus in _Titans_, which is
different than the focus of Beam Saber)[^1].

So yea... basically, game design is really hard, but really cool. I've been
really enjoying this.

---

[^1]: Bad long parenthetical!
