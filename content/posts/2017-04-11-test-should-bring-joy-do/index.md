---
title: "assert practice_tdd, joyful"
layout: post
permalink: :year/:month/:day/:title/
categories: code
tags: test-driven-development, ruby, learning-ruby, vacation_post
comments: true
---

A parable told in code.

```ruby
class Rubyist < Human
  include EmotionalAccessors
  include RelationshipToTDD

  attr_reader :tdd, :experience, :joy, :worry_about_others_perception

  def initialize
    @worry_about_others_perception = 10 # or so I'm told
    @experience = 2 # years, on average?
    @joy = 0 # cannot be inferred without more data
  end

  ...

end

class RubyN00b < Rubyist

  def initialize
    super
    @worry_about_others_perception += 500
    @experience = 0
    @tdd = false
  end

  ...

end
```

<!-- more -->

```ruby
# and we continue...
class RubyN00b

  ...

  def write_code
    code = Code.new('first code')
    show_off_code
  end

  def show_off_code
    if code.looks_good?
      @worry_about_others_perception -= 1
    else
      @worry_about_others_perception += 3
    end
  end

  def follow_tutorial(tutorial)
    write_code

    practice_tdd if tutorial.teaches_tests?

    write_code #more, more!

    gain_experience(2)
    joyful(1)
    worry(-2)

    forget_tdd unless tutorial.tests.save_ass?
  end

  def develop_something_for_real
    BOAST = <<-HEREDOC
    Ahh yea! I'm so cool! I'm gonna make something that is gonna change the world!
    You'll all see, I can do anything.

    What, tests? LAAAAAAAMMMMMEEEEEE!!!!! I never actually needed them before.

    Tests are for lamers!!!
    HEREDOC

    if @tdd
      code = Code.new('decent')
      worry(-1)
      brush_self_off_and_do_it_again
    else
      puts BOAST
      code = crash_and_burn # but...

      eventually_rise_from_the_ashes
    end
  end

  def crash_and_burn
    puts 'AAAAAAAAAHHHHHHHHH!!!!!!!!'
    joyful(-10)
    worry(100)
    Code.new('terrible')
  end

  def eventually_rise_from_the_ashes
    puts '*weeping*'
    blindly_follow_all_the_tutorials_until_something_clicks
    joyful(realize_tests_are_magic)
  end

  def brush_self_off_and_do_it_again
    while @tdd
      develop_something_for_real
    end
  end
end



# Descriptive setter methods for instance variables
module EmotionalAccessors
  def joyful(amt)
    case amt
    when > 0
      puts 'Huzzah!'
    when < 0
      puts "I'm so sad..."
    when 0
      puts 'I feel neutral about this.'
    end
    @joy += amt
  end

  def gain_experience(amt)
    @joyful += amt
  end

  def worry(amt)
    @worry_about_others_perception += amt
  end  
end



# Descriptive setter methods for a special instance variable
# And the power to be a better developer
module RelationshipToTDD
  def practice_tdd
    @tdd = true
    gain_experience(2)
    joyful(1)
    worry(-10)
  end

  def forget_tdd
    @tdd = false
    gain_experience(-2)
  end

  def blindly_follow_all_the_tutorials_until_something_clicks
    tutorials = TutorialsOnTheWeb.new('all')

    until @tdd
      tutorials.each do |t| { follow_tutorial(t) }
    end
  end

  def realize_tests_are_magic
    @tdd = true
    self.remove_method(:forget_tdd) # never forget! (never surrender!)
    9000 # amount of joy experienced
  end
end
```

```ruby
class PostScript < RubyN00b
  def initialize
    puts "I worry about some of the metaprogramming in this code being wrong and people judging me..."
    worry(5)
  end

  def gotcha
    puts "So... where are the tests?"
  end
end
```
