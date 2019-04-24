---
title: "Ruby n00b learns about: Bundler vs Rake vs Guard"
layout: post
permalink: :year/:month/:day/:title/
categories: code
tags: ruby, dev, ruby-for-dummies, ruby-n00b-learns
---

As I was starting out with Ruby, I quickly encountered three... *things* that popped up everywhere: **[Bundler](https://bundler.io)**, **[Rake](https://github.com/ruby/rake)**, and **[Guard](https://github.com/guard/guard)**.

I learned pretty quickly (because all of the really nice Rubyists on the internet are very willing to tell you this) that they are three Ruby tools for making Ruby development easier, more consistent, and better.

They're all clearly *different* (else why the heck would a community that tries to be as expressive as possible duplicate its tools for no reason)... but it isn't immediately clear to the n00b *how* they're different. The first time you're likely to use them, it's often going to be to prefix your commands when running your code.

Which makes them all look like [taskrunners](https://www.quora.com/What-is-task-runner), and at first blush, and I was confused about when to use which.

<!-- more -->

{% include image.html
  img="assets/images/post-images/confused-clefairy.gif"
  title="me using the codes"
  caption="Clefairy launches the space shuttle... or a nuke... or the toaster"
%}

So, they're not all task runners.

- **Bundler** is a configurator for your Ruby project, and allows you to specify which gems, and which *versions* of those gems, should be used in your project (aka 'dependencies').
- **Rake** *is* a taskrunner. It runs discrete, core (the important) development tasks.
- **Guard** is *also* a taskrunner, but unlike Rake, it's an always on kinda thing. It automates the running of other tasks, like Rake tasks.

Let's get a little more detail.

### Bundler

Bundler is great, because at this point, there a quite a few different versions of Ruby, and the gems we use, that it can be hard to make sure that two people working on the same project (or, one person working across multiple computers) are actually using the same underlying code. Things can change from one version to another.

When you use Bundler, you create a file, called your `Gemfile` in the root of your project, and in it you specify which gems you need, and even which versions (either specific, or newer than a certain version, or older... you've got options). Then run `bundle install`, and Bundler reads the `Gemfile` and installs those specific versions of the gems. It also creates a `Gemfile.lock` for you. If the `Gemfile` is your shopping list, the `Gemfile.lock` is your receipt from the market--it tells you exactly what you've got after running Bundler (don't edit this guy yourself. That's like tax fraud).

```ruby
# Gemfile

source 'https://rubygems.org'

gem 'rails',          '5.0.1'
gem 'puma',           '3.4.0'
```

```ruby
# Gemfile.lock; don't edit this yourself

GEM
  remote: https://rubygems.org/
  specs:
    actioncable (5.0.1)
      actionpack (= 5.0.1)
      nio4r (~> 1.2)
      websocket-driver (~> 0.6.1)

    ...

PLATFORMS
  ruby

DEPENDENCIES
  byebug (= 9.0.0)

  ...

BUNDLED WITH
   1.14.6
```

Bundler also allows you to run commands on a project where things are in different versions from your system defaults. Instead of running `ruby awesome-thing`, you run `bundle exec ruby awesome-thing`, and Bundler makes sure that everything is done with what you've told it to use for this project. If you're using Bundler, it's a good idea to prepend all your commands with `bundle exec`.

I've recently been working through the [Rails Tutorial](https://railstutorial.org/book), and kept getting `FIXNUM is deprecated...` warnings. Turns out, it *is* deprecated in Ruby 2.4.0. So I switched to Ruby 2.2.5, and the warnings have disappeared (related: check out [RBenv](https://github.com/rbenv/rbenv) for installing and switching between different versions of Ruby--super easy to use, and very useful on a Mac where the system version of Ruby, 2.0.0-p648, is past End of Life).

Changing the Ruby version I've been using could have caused a bunch of issues for my gem dependencies, because they wouldn't have been installed properly for that new version of Ruby. Bundler makes this pretty easy though--run `bundle install` again, and Bundler makes sure that you have the right gems, in the right place, for your project. Helps avoid those weird errors that happen just because you've got some idiosyncratic setup.

### Rake

The name is a cute portmanteau of *Ruby make*, named for the Unix tool *Make*, and performing similar functions: it won't compile[^1] your code (because Ruby isn't compiled in the same way as lower-level languages). But it does run the important tasks like testing your code, or maybe deployment. You set up individual, discrete tasks in your `Rakefile`:

```ruby
# Rakefile

desc "One line task description"
task :name_of_task do
  # Your code goes here
end
```

When you call up Rake tasks, you use the syntax `rake name_of_task` (ommitting the ':' off the beginning because rake will figure that out for you). Rake will then do whatever was in that task.

One of the most frequent uses of Rake is to run code tests (`rake test`). If you're doing this, you'll need two things in your Rakefile - tell it how to run tests (by requiring the `rake/testtask` classes included in Rake), and where your test files (that you'll need to have written, beyond the scope of this post) are located:

```ruby
# Rakefile

require 'rake/testtask' # This is where you tell Rake to use the testtask class

Rake::TestTask.new do |t| # This is where you tell Rake where to find your test files
  t.libs << "tests"
  t.test_files = FileList['tests/test*.rb']
  t.verbose = true
end
```

You can do pretty much anything with Rake, but in general Rake tasks should automate single, but core functions you would otherwise have to perform manually (deploying to a server: good; running some file in a loop: bad).

Also, if you're using Bundler, don't forget `bundle exec rake <task name>`.

### Guard

Where Rake should be used for single operations, Guard is here to automate things that can/should be on loops. The name is also good, once you get it: it *guards* (read: watches) the files you tell it to for changes, and then initiates other tasks when it sees changes, like running `rake test` when it sees you update one of your test files. Nice, because it means you don't have to explicitly run the task yourself.

Much like everything else in this post, it's got its own file (`Guardfile`) where you configure it, and then set it off on the commandline: `[bundle exec] guard <task name>`.

Guardfiles look a lot like Rakefiles in the way they're set up:

```ruby
# Guardfile

guard 'test/*' do
  bundle exec rake test
end

```

You 'guard' a file or files, and 'do' something when they change. The obvious example (as above) is watching your test files for changes, and running `rake test` if you update or save a new one, though you can get fancier too.

To start it run `[bundle exec] guard` and then ignore it until you see an error. You should probably do this in a new terminal because guard just loops until it hits an error, so you won't be getting command back (unless you force it to stop with Ctrl-C).

You can also set up different Guard groups--different sets of tasks in you `Guardfile` that you run with `guard group <group name>`. Check out [Guard's docs](https://github.com/guard/guard/wiki/Guardfile-DSL---Configuring-Guard) for more examples.

## With our powers combined...

Use them all together!

Bundler does your installation with `bundle install` and makes sure your commands run with the right versions and gems with `bundle exec <command>`.

And use Guard to automatically fire you Rake tasks so you don't have to (using `bundle exec` to start Guard)!

  {% include image.html
    img="assets/images/post-images/captain-planet.gif"
    title="Captain Planet"
    caption="COMBINE! COMBINE! COMBIIIIINNNNNEEEEE!!!!!"
  %}


---

[^1]: Seriously y'all, go take [CS50x](https://www.edx.org/course/introduction-computer-science-harvardx-cs50x). It's free, and even just the first few 'weeks' of it are a great grounding to have before you move on to something like Ruby or Python because you'll get a feel for what the machine is doing underneath the gorgeous Ruby hood.
