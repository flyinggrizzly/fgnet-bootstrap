---
layout: post
title: Making my first PR to an open source project
categories: dev
tags: open source, development, speakerline
---

I've recently made my first big PR to an open source project, [Speakerline](https://github.com/nodunayo/speakerline/pull/66). The maintainer is aces, and the whole process has been enoyable and instructive. It's the instructive I'd mostly like to talk about though ;)

<!--more-->

The things I want to talk about all tie into one thing: the size of the PR. It's a pull for a single feature, so it's not like I've gone and bodged 6 features and 2 bug fixes into a single merge commit, but it's still pretty chunky. Stats for it are 588 additions against 200 some-odd removals, across 46 files. So yea, not negligible.

I think the thing that hadn't really occurred to me until I was asking the maintainer to review this is difference betwewen our applications at work, where we're paid to review and maintain them, and an OSS project like Speakerline, where it's a labor of love.

At work, while we try to avoid it, we will occasionally make big PRs like this when we're making a big change to our applications. With Rails, it can be really hard to untangle the dependency between the model and the view, or the model and the controller, or the model and its related models[^1], and so sometimes, we bite the bullet and commit to spending more time reviewing and validating larger pieces of work. We *could* make the changes to a model, and at the same time make try and make that changed model still respond to its old interface so the views don't have to change... but then we'd have to change them anyways. At the end of the day, Rails treats the model, view and controller for any given resource as attributes of an uber-class. They all want to change together.

That... got off on a tangent there. Regardless, at work we have the privilege to be able to commit to making big changes like that, because we're paid to do so. Avoided whenever possible, but it's something we keep in our back pocket.

It's a much bigger ask when talking to someone who maintains a project in their spare time. 

I think the way I'd go about this if I were doing it again would be to talk to the maintainer, and get their view on how they might like the changes to be broken up. With this PR, I had been talking to her since December, and had sent her a prototype of the implementation I had been thinking, which was definitely the right move.

That said, the fact that I was prototyping the change before making it probably should have sounded the alarm that it was going to be big and would need more close management.

The next time I PR against Speakerline, I'll be talking to the maintainer first to try and figure out ways to break bigger changes like this down into smaller chunks, even if they all line up as PRs to be reviewed in quick succession. It's not about my time--I'm the one with the whole picture in my head. It's about hers--she'll be coming to my changes cold, and being presented with 45 changed files can be a little much maybe (anyway, she's been great and while she's said pretty much this exact thing has also been great about reviewing the PR and communicating when that would happen).

So yea. That's about it. Think about the size of the PR I'm making, and talk to the maintainer about how to handle that change. Seems like the right way to do things!


---
[^1]: This *isn't* a statement on whether or not that's good or bad though!
