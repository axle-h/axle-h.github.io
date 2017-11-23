---
layout: post
title:  "The Modern Development Paradigm Shift"
date:   2017-11-22 22:26:00 +0000
author: Alex Haslehurst
categories: software development methodology
---

When put into context by the birth of HTTP being over 25 years ago, or the almost 50 years worth of milliseconds added to UNIX time since the epoch, my 5 year software development career is very short. But even during this time I have seen an exponential shift in software development methodologies and technology. This has been unanimously for the better and means that we are no longer reinventing the wheel every day and are instead making cool stuff. Some teams have embraced this, accepted that what they learnt 3 years ago is now almost useless, discarded it and moved on. Others, however have simply fallen behind.

<!--break-->

Today that means that I observe two distinctive development team flavours. There’s those that have taken the shortest path, using familiar but aging techniques and falling for all of the same mistakes that have left us with this mess that we now call legacy software. All they seem to do today is hopelessly churn out bug fix after bug fix on top of a poor foundation of untested and buggy spaghetti code, whilst throwing statements around like “why write unit tests when you can just write more code” - an unbelievably genuine quote I heard early in my career. Most efforts are exhausted fighting the fires of yesterday to consider the scalability concerns of tomorrow.

Then there’s those that embrace new technology. Leveraging the latest techniques and enjoying a jargon filled world of DRY SOLID code, doing everything backwards thanks to TDD, being happily ridiculed by our non-technical partners for reading heavy books on design patterns, whilst standing on the shoulders of giants. Giants who always seem to have one-word catchy names like Splunk, Angular, Node, Spark - what happened to being simply named by your primary function?

Software development in these teams is a genuine pleasure. Everyone knows what everyone else is doing and everyone is heard thanks to an Agile world of stand-ups, Kanban boards, sprints and code reviews.

Releasing on Fridays is still risky but we feel confident in our weekend plans thanks to the 4 releases we’d made earlier that week and the complete suite of integration tests running after each build within containers on the CI platform.

The client and server applications may even be written in the same language these days but they are always separate, with distinct repositories, builds, tests and release schedules. There's even separation of model and view on the client thanks to frameworks like Angular - no JQuery in sight thankfully.

We are even starting to understand that blindly normalizing everything in order to shoehorn our data into a relational model can potentially cause more problems than it solves. We no longer react to data driven greenfield projects by immediately grabbing our highest specced server and loading it with expensive proprietary database systems, whilst hiding it all away behind an ORM that sort of works but generates queries that no human could ever understand. We can instead start off smartly by considering modern options like MongoDB and Cassandra and will develop an understanding of what our data will actually be doing, not what it might do, so that we can better structure our model to fit our queries - never the other way around. We now spend far less time worrying about table locks, what happens when that monster SQL server falls over or how we’ll ever scale it out and more time enriching our data with new analytics and machine learning techniques to better deliver value to our customers.

Security is no longer optional. Google shun us if we’re not SSL by default and our users disregard us immediately if that green lock next to our URL is missing. We no longer roll our own security but can instead lean on battle tested systems like Identity Server and industry standards like OAuth2 whilst even picking up a few conveniences along the way such as JWT. We’re finally taking things seriously across the business and learning from disasters of the past - god forbid we end up like Equifax or Yahoo.

Everything is scalable, meaning that thanks to our lightweight, stateless API’s sitting behind load balancers that actually work because they’re managed by someone else, we can just “spin up another node” and add it to the swarm - or the finely tuned auto scaling rules can do this for us.

Everything seems cheaper too. Who needs to buy servers or the latest version of Windows Server running millennial technology like a user interface, IIS and what I now like to call “full fat” .NET when we can do it all license free and open source with a mixture of technologies like .NET Core, NATS and NGINX running in Docker Swarm on Linux. Ok not entirely open source but we're definitely getting there.