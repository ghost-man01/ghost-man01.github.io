---
layout: post
title: "The Hidden XSS"
date: 2025-04-04 00:00:00 +0500
pin: false
categories: ["Bug Bounty"]
tags: ["Bug Bounty", "Write-Up", "Security Blog"]
image: assets/images/ghostMediation.gif
---

Hey fellow Bug Hunters or Security Researchers, as you got the title pretty much clear it's a tale of XSS hidden in the mist (Naruto Fans get it). Let's get started, 

## Starting the Hunt on Paytm

In November 2024, I was testing on Paytm and you know I'm noob at that time (still). I don't know where should I start hutning so I collected every subdomain using _subfinder_(automated tool). I started opening every subdomain of Paytm and many hours later realized, I just get from where I started the position is 0 😂 literally frustating because I am doing nothing just opening tabs in my FireFox.

## Digging Deeper with Waybackurls

Next day, I decided to use _waybackurls_(tomnomnom's tool) tools to collect historical data of Paytm, after 10 minutes I'm having a lot of urls with many files there but the problem is same again **WHAT DO I LOOK FOR** in these files. A lot of files with _png/jpg/woff_ extension which basically means nothing.

## Building GhostFilter

Then I decided to create a tool named as [GhostFilter](https://github.com/ghost-man01/GhostFilter) for filtering all those unnecessary files url like png/jpg/woff. I know what you're thinking isn't **grep** command work same thing to filter out stuff so just create a simple _Bash_ script. Well the tool isn't just for filtering unnecessary files it's calculating frequery of sensitive key words like **auth, token, secret, internal** similar keywords and yeah GhostFilter isn't based on Bash Script, it's using Go Programming which has concurrency during filteration of files. Read in detail about _GhostFilter_ on [medium.com/ghostman01](https://ghostman01.medium.com).

## Putting GhostFilter to Work

Time to put _GhostFilter_ in work, so I gave it all my url from waybackurls and It filtered out every unnecessary file and I got a lot of sensitive keywords frequency. But instead of jumping right into sensitive urls I prefer to check the unnecesary files and yeah you're right **These're unnecesary files so why are I checking them**. The answer is I want to see the result of _GhostFilter_.

## Finding the First Clue

Among all those unnecessary urls of wayback, One url caught my view the url as follows:

    https://xyz.paytm.com/abc/v2/index.html


I clicked on that index.html url and I got blank page, so I go for looking at page source code for any js file or html comment on page from developer. But there is none just a React Favicon on top and stating **JavaScript should run for this app**. It's likely a mobile application.

## Fuzzing for More

The second thought in my mind is there could be any other file on the server except _index.html_, so like many other Bug Hunters I will go straight for FUZZING with **ffuf** and the wordlist is just Seclist's/raft-medium-files.txt and after sometime I got one file exposed **qa.html**

The updated url is:

    https://xyz.paytm.com/abc/v2/qa.html



## Hunting for XSS

The qa.html is an internal form page and the form means time XSS Hunt. There are many fields like **Name, Data, Author** and ofcourse a submit button. So I give just simplest payload 

```html
<script>alert(0);</script>
```

to all the field and clicked on the Submit button and the error showed up stating Data expecting JSON data from me.

## First Payload Attempt

So I just modified the Data field with:

```json
{
  "1": {
    "name": "ghost__man01",
    "originalName": "<script>alert('Siddhant Shukla');</script>"
  }
}

```
When I clicked on the Submit button with JSON data, it's validating the `<script>` tag and not sending my data to server.

Second Payload Success
So I update the JSON data again:
```json
{
  "1": {
    "name": "ghost__man01",
    "originalName": "Siddhant Shukla",
    "image": "<img src=x onclick=alert('Hacked by Ghost')>"
  }
}
```



This time the payload works with Image tag and pop-up with Hacked By Ghost. Eventually it's an Self-XSS and tried to esclate it, unfortunately I can't make it more impactful then I reported it through [Paytm's Bug Bounty Program](https://bugbounty.paytm.com/).

## The Outcome

After somedays I got response from Paytm Security Team, the Bug is valid and they're working on fix and marked my Bug low severity as it's out-of-scope bug. I ended up getting certificate from Paytm Security Team.

![Paytm Confirmation Mail](/assets/images/paytmConfirmation.png)
![Paytm Security Appreciation Certificatet](/assets/images/paytmAppreciationCert.png)

## Wrapping Up
That's all for this write-up follow me on [medium.com/ghostman01](https://ghostman01.medium.com/) as the other write-up going to be there.