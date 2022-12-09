---
title: "Mollys Movies"
logo: mollys-movies/logo.png
banner: mollys-movies/banner.png
date: 2022-4-07 12:00:00 +0000
categories: software development
---

TODO before publishing:
* Security

Mollys Movies is a long running, over engineered hobby project of mine and a decent (if not controversial) showcase of some of the unique constraints of microservice design.

First a disclaimer: we pay for Netflix, Amazon Prime, Disney+ and will go to the cinema when there's somethng we want to watch. The legality of using this service is questionable but morally, I am happy to use it to consume niche & unavailable content or content that I already own on physical media.

## The (first world) Problem

> "I'd like to watch this random movie that's not on Netflix"
>
> -- <cite>Non technical family member</cite>

Me:

1. Find my laptop, connect to Tor
2. Search for a decent quality torrent
3. Add it to transmission
4. Wait for the download to complete
5. Move the files to our movie library
6. Refresh Plex

Surely this can be automated right?

## Pain points

The data used by this project is available on public Bittorrent trackers. Consuming these services has some issues. 

* They're blocked by my ISP.
* They're unreliable.
* They're likely to be taken down.
* I need extra meta on top of their data i.e. have we downloaded the movie already? where is it's image file?

## VPN

The only place I would be comfortable running this app is my home network so I am subject to the UK ISP firewall, which is likely to include all of the (relatively speaking) reliable trackers. So I am forced to tunnel connections through a VPN.
I first had a go at using TOR for this but found that services would often be using CloudFlare DDoS protection, which forces TOR exit traffic through a browser check.
It's beyond the scope of this project to bypass this, so instead I looked at proxying through a free tier OpenVPN tunnel.
For this I used a comination of a SOCKS5 proxy via Dante on top of OpenVPN. Running this in a container simplifies configuration as proxied traffic is exclusively routed through the VPN.

## Scraping

Torrent services are unreliable so to consume them live would mean:

* Availability issues would propegate into the app.
* There would be no fallback if they dissappeared, best case the app stops working until a new service is used, worst case, the app is coupled too tight to a dead service and major changes are needed.
* It would be flaky to store metadata for such a remote service.

Periodically scraping all data needed to serve requests locally is preferred.

## Services

* **UI** Angular app with a Bootstrap UI.
* **API** Scalable, public .NET API for the UI.
* **Scraper** .NET app for running the scrapers async over a message bus. This is the non-scalable component of the service as only one scrape can run at a time.
* **VPN** OpenVPN & Dante, tunnels proxied requests through a free-tier VPN.
* **Transmission** Torrent client with an RPC API.
* **Callback CLI** .NET CLI for notifying download complete via Transmission on-complete script.
* **Plex** Media library manager with a REST (XML...) API.
* **Mongo** Database.
* **RabbitMQ** Messaging.

TODO add diagram here

## Process

TLDR; scraped movies are searchable and downloadable via the UI. Once downloaded, they are available to watch via Plex.

1. Initially, a scrape is started via the UI. The scraper service handles this async, one at a time, the database is populated from all available movies on configured torrent sites and all movies in the Plex library are marked as downloaded.
2. User searches for a movie via the UI, I'm using Mongo's full text search for this, which is a nice compromise between search quality and the complexity of running ElasticSearch.
3. User chooses to download a movie, a magnet URI is built and forwarded to Transmission for download.
4. When the download is complete, the Callback CLI is run via the Transmission on-complete script, which publishes a notification.
5. The Scraper service consumes this and completes the process:
    1. Moves the downloaded movie into the movie library, deleting any crap that was downloaded e.g. text files.
    2. Refreshes the Plex library via it's API.
    3. Updates the database.
6. The UI is updated and the movie is available to watch in Plex.

## Running

All components of mollys-movies except Plex can be orchestrated on Kubernetes via helm *note it would be possible to also run Plex on k8s but there are some compromises*. It only makes sense for me to run mollys-movies on a single node via k3s but each microservice has been designed to be scalable. The most significant blocker is management of shared access to host storage.

```
# TODO simple set of commands for installing k3s, plex and the chart from github packages
```