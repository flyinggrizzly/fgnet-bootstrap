---
title: 'Url Grey v 0.3.1 release notes'
application: url-grey
release_version: '0.3.1'
layout: release-notes
permalink: :year/:month/:day/:title/
categories: code, application
tags: [url grey, url shortener, release, url grey release notes, security patch]
---

This release patches [Nokogiri CVE-2017-9050](https://hakiri.io/projects/570308c3e1bc06/stacks/b4c647e4e04ef8/builds/ae1bb738e5f2b2/warnings?name=Denial+of+Service) to protect from Denial of Service attacks.

<!-- more -->

There was a vulnerability in one of Nokogiri's underlying XML libraries in versions earlier than 1.8.2. This release updates all dependencies, including Nokogiri, to patch the vulnerability.
