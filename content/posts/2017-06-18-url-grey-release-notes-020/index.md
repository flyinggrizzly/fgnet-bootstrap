---
title: 'Url Grey v 0.2.0 release notes'
application: url-grey
release_version: '0.2.0'
layout: release-notes
permalink: :year/:month/:day/:title/
categories: code, app
tags: [url grey, url shortener, release, url grey release notes]
---

This release implements basic tracking of short URL usage. It tracks the following data:

- IP address of request
- user agent of request
- time of request

It renders the number of hits against a short URL in the last month, and over all, in the *show* view. These values are calculated with a private class method on `ShortUrlHit`: `ShortUrlHit::count_in_period(begin_date, end_date)`--which should be called by public class methods, such as `ShortUrlHit::count_last_30_days`.

It also switches the app to using [semantic versioning](http://semver.org).

## The weird roadblock I hit with a migration

I ran into a strange database migration behavior (Rails 5.1 and Postgres 9.6), where adding a reference inside a `create_table` block would fail. I used the in-built model generator to get the migration: `rails g model ShortUrlHit ip_address:string user_agent:string short_url:references`, which generated the following migration, to which I added the index bit:

```ruby
# This doesn't work
class CreateShortUrlHits < ActiveRecord::Migration[5.1]
  def change
    create_table :short_url_hits do |t|
      t.reference :short_url, foreign_key: true
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end
    add_index :short_url_hits, :short_url_id
  end
end
```

Weirdly, every time I ran the migration, I got an error reporting that an index already existed on the column. I rammed my head against this for a but, but finally gave up and rewrote the migration as follows:

```ruby
# This works
class CreateShortUrlHits < ActiveRecord::Migration[5.1]
  def change
    create_table :short_url_hits do |t|
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end
    add_reference :short_url_hits, :short_url, index:       true,
                                               foreign_key: true
  end
end
```

Moving the reference command outside the `create_table` block, and declaring that it needed to be indexed and it was a foreign key all at the same time seems to have worked.

I'm not 100% sure *why* it didn't work the first way, but did the second, especially since the first was a Rails generated migration (other than the index), but... ¯\\\_(ツ)_/¯. It works fine the other way.

That said, if anyone can see an obvious error I've made, please do let me know.
