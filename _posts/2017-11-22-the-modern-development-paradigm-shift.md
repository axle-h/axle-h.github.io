---
layout: post
title:  "The Modern Development Paradigm Shift"
logo: the-modern-development-paradigm-shift/logo.png
date:   2017-11-22 22:26:00 +0000
author: Alex Haslehurst
categories: software development methodology
---

When put into context by HTTP's 25 year lifetime, or the almost 50 years worth of milliseconds added to UNIX time since the epoch, my 5 year software development career is very short. But even during this time I have seen an exponential shift in software development methodologies and technology. This has been unanimously for the better and means that we are no longer reinventing the wheel every day and are instead making cool stuff. Some teams have embraced this, accepted that what they learnt 3 years ago is now obsolete and almost useless, discarded it and moved on. Others, however have simply fallen behind.

<!--more-->

Today that means that I observe two distinctive development team flavours.

## Legacy teams

I would classify legacy development teams as those that have taken the shortest path, hung on to familiar but aging techniques and continuously fallen for all of the same mistakes that have left us with this mess that we now call legacy software. All they seem to do today is hopelessly churn out bug fix after bug fix on top of a poor foundation of untested and buggy spaghetti code, whilst throwing statements around like:

> “why write unit tests when you can just write more code” - *an unbelievably genuine quote I heard early in my career*

Legacy teams seem to have been blind to existing, off the shelf solutions to common problems, instead believing themselves to be the first to bear witness and so developing their own solutions from scratch. These custom solutions often result in questionable success and are always accompanied by ridiculous maintenance burdens. All of this mess eventually accumulates into a stressful daily grind where most efforts are exhausted fighting the fires of yesterday, leaving barely any time at all to consider the scalability concerns of tomorrow.

Applications developed by legacy teams resemble a pile of everything ever developed, somehow still standing upright and wrapped up in horrendous monolithic beasts that no one dare touch for fear of toppling the whole tower. When working with even the most brilliantly written monoliths, I have observed in horror as seemingly routine deployments have caused application components to fail spectacularly due to some unforeseen side-effect of some obscure new feature, ending the whole process in fiery disaster. The fix for these situations has all-to-often been to hope that you can still roll everything back to the previous version, losing all developed features and fixes, no matter how unrelated - *what a shame*.

Legacy application scalability is a joke as state must be handed off to replicas, deployment is of a complexity comparable to particle physics and application start-up time is bordering on glacial. Auto-scaling is completely out of the question as infrastructure is still firmly rooted on-premises and managed by a man armed with knowledge of SAN's and a screwdriver instead of by dev-ops engineers armed with knowledge of AWS, scripts and API's. The most common excuse I've heard for not using the public cloud is cost, a completely naïve and very often invalid argument in my opinion. Oh and forget integration tests - *good luck finding, configuring and running all dependent components within reasonable time.*

## Modern teams

Modern development teams are many things but are definitely not afraid to accept change and embrace new technology. They should be leveraging the latest techniques and enjoying a jargon filled world of DRY SOLID code, be doing everything backwards thanks to TDD, be holding considerations of design patterns at the forefront of their development process, whilst standing on the shoulders of giants. Giants who always seem to have one-word catchy names like Splunk, Angular, Node, Spark - what happened to simply naming software after it's primary function?

Software development in these teams is a genuine pleasure. Everyone knows what everyone else is doing and everyone is heard thanks to an Agile world of stand-ups, Kanban boards, sprints and code reviews.

### Modern applications

Forget unwieldy monolithic applications of the past, the cool kids of modern development teams are now writing applications according to a distributed microservice architecture. This is by far the most important cultural change that I've witnessed during my career. The pleasure and relative safety of working on tiny, truly decoupled subsets of business logic, one at a time has had the most serious impact on not only my daily tasks but also those of the development team as a whole.

Deploying modern microservice applications on Fridays is still risky but we feel confident in our weekend plans thanks to the 10's of releases we'd made earlier that week, the fact that we're only deploying a subset of our architecture and the confidence boost of a complete suite of integration tests running after each build within containers on the CI platform. The application almost feels evolutionary, carefully but rapidly being optimised towards an agile specification instead of lurching forwards in dirty great, unsafe leaps and bounds.

The pleasure of development in modern teams is even now extending to client applications. In fact, for most developers even considering the client as an application in it's own right, with distinct repositories, builds, tests and release schedules is revolutionary. Then the introduction of ridiculously developer friendly technologies like TypeScript and transpilation, wrapped up in modern SPA frameworks like Angular is a literal dream come true - *dirty JQuery hacks are finally, officially banned*.

### Modern data

We are even starting to understand that blindly normalizing everything in order to shoehorn our data into a relational model can potentially cause more problems than it solves. We no longer react to data driven greenfield projects by immediately reaching for a server with the most extreme specification possible and loading it with expensive proprietary database systems, whilst hiding it all away behind an ORM that sort of works but generates queries that no human could ever understand. We can instead start off smartly by considering modern options like MongoDB and Cassandra and will develop an understanding of what our data will actually be doing, not what it might do, so that we can better structure our model to fit our queries - *never the other way around*. We now spend far less time worrying about table locks, what all those stored procedures and triggers are actually doing, what happens when that monster SQL server falls over or how we'll ever scale it out and more time enriching our data with new analytics and machine learning techniques to better deliver value to our customers.

### Modern security

Security is no longer optional. Google shun us if we're not SSL by default and our customers disregard us immediately if that green lock next to our URL is missing. We no longer roll our own security but can instead lean on battle tested systems like Identity Server and industry standards like Open ID Connect, whilst even picking up a few conveniences along the way such as JWT. We're finally taking things seriously across the business and learning from disasters of the past - *we're finally trying hard to avoid the examples set by companies such as [Equifax](http://www.bbc.co.uk/news/technology-43241939) and [Yahoo](http://www.bbc.co.uk/news/business-41493494).*

### Modern infrastructure

Everything is scalable, meaning that thanks to our lightweight, stateless API's sitting behind load balancers that actually work because they're managed by someone else, we can just “spin up another node” and add it to the load balancing group - *or the finely tuned auto scaling rules can do this for us*.

Everything seems cheaper too. Who needs to buy servers or the latest version of Windows Server running millennial technology like a user interface, IIS and what I now like to call “full fat” .NET when we can do it all license free and open source on the public cloud, with a mixture of technologies like .NET Core, MongoDB and NGINX running in Kubernetes on Linux. Ok not entirely open source but we're definitely getting there.

We still need a disaster recovery plan but the thought of a disaster is a far less scary one due to our entire cloud based infrastructure and microservice architecture being explicitly defined in a version controlled project consisting of a Terraform plan and a set of declaratively written Kubernetes configuration files. Whilst we're sleeping, Kubernetes is busy dealing with our **dirty human errors**, thankfully avoiding that dreaded 3am support ticket. Then if *shit really does hit the fan*, with a couple of simple, scripted commands we can spin up an entirely new environment from scratch from the comfort of our development machines, pulling in our backups from dirt cheap long term cloud storage, without ever having to reach for a screwdriver or even an SSH client.

Even though we now have all of these powerful operational tools at our disposal, ready and waiting to be deployed as our next *get out of jail free card*, we'll probably (touch wood) never actually be forced to wield them in anger. Our priorities and ideas have shifted to prevention, automation and understanding instead of reaction and fire fighting. Instead of scrambling around and dealing with disasters after the fact, we are actively looking to prevent them by investing dev-ops time and company resources to understand, monitor and refine our application as technology and customer behaviour changes. Hell, we have even been arming [bees with machine guns](https://github.com/newsapps/beeswithmachineguns) pointed directly at our own application, purposely forcing it to it's knees in order to help us develop emergency policies and identify components most venerable to attack.

## Final thoughts

Obviously my opinions are my own but which flavour of development team is yours?