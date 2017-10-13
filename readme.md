[![](http://wes.io/kH9O/wowwwwwwwww.jpg)](https://LearnNode.com)

# Learn Node Starter Files + Stepped Solutions

These are the starter files and stepped solutions to accompany the LearnNode.com course.

You'll start your application in the `starter-files` directory — feel free to rename it.

If you need help, each folder number corresponds with where you should be at the *start* of a video. So if you are having trouble with video **24**, look to video **25** for the answer.

The stepped solutions are meant for you to apply on top of your existing code - they don't stand on their own. 

Not all videos have a solution as their changes aren't significant enough.

## Getting Help

Need some help? Want to chat with the other learners? The Slack Chat that accompanies this course is where you should be asking questions — this repo is meant as a place to grab the starter files and isn't a support channel.

## Pull Requests

If you found a different / better way to solve problems in the application, great! These files are meant to be as close to 1:1 as they are shown in the videos so I generally won't accept any pull requests for changing how the application functions.

Glaring errors, clarifications and files that aren't shown in the videos are totally fair game for pull requests and are appreciated.

Enjoy!

## FAQ

### The Google Maps API key isn't working

The course might have hit a limit with the API key — if this is the case you need to sign up for your own API key over at <https://developers.google.com/maps/documentation/javascript/usage>. You will need to enable static maps for your API key. [Here is a quick video on how to do this](http://wes.io/khGn). 

Once you have the API key, simply place it in your `variables.env` file and restart.

### I'm getting errors related to `/data/db` like `code:100` and `connection failed`

Check out [this answer](https://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder#answer-7948986) on stack overflow to get mongoDB running locally.

## I'm getting a `URIError: URI malformed` error when running `npm start`

Thanks to [Chris Ellinger](https://twitter.com/devoidofgenius) for this: 

> If you’re getting a `URIError: URI malformed` error when running `npm start`, break out your environment variables. Go into `variables.env` and split the URI like this `MONGO_URI=mongodb://host.com:port` `DB_USER=username` and `DB_PASS=password`. Then inside your `start.js` replace `mongoose.connect(process.env.DATABASE)` with `mongoose.connect(process.env.MONGO_URI, {user: process.env.DB_USER, pass: process.env.DB_PASS});`. I had issues connecting to my mongodb because my password contained symbols.

## Contributors

<!-- CONTRIBUTORS LIST:START -->
[<img alt="wesbos" src="https://avatars6.githubusercontent.com/u/176013?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=wesbos) |[<img alt="vladikoff" src="https://avatars7.githubusercontent.com/u/128755?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=vladikoff) |[<img alt="chasingSublimity" src="https://avatars7.githubusercontent.com/u/21029639?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=chasingSublimity) |[<img alt="camjm" src="https://avatars5.githubusercontent.com/u/2276730?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=camjm) |[<img alt="htmlandbacon" src="https://avatars4.githubusercontent.com/u/4334015?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=htmlandbacon) |[<img alt="eduplessis" src="https://avatars5.githubusercontent.com/u/398245?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=eduplessis) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Wes Bos](https://github.com/wesbos) |[Vlad Filippov](https://github.com/vladikoff) |[Blake Sager](https://github.com/chasingSublimity) |[Cam](https://github.com/camjm) |[Colin Oakley](https://github.com/htmlandbacon) |[Edouard Duplessis](https://github.com/eduplessis) |

[<img alt="antibland" src="https://avatars5.githubusercontent.com/u/219139?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=antibland) |[<img alt="marcus-crane" src="https://avatars6.githubusercontent.com/u/14816406?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=marcus-crane) |[<img alt="mikeybyker" src="https://avatars7.githubusercontent.com/u/1440962?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=mikeybyker) |[<img alt="mohitgarg" src="https://avatars6.githubusercontent.com/u/14136405?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=mohitgarg) |[<img alt="zero-t4" src="https://avatars7.githubusercontent.com/u/7101905?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=zero-t4) |[<img alt="RCopeland" src="https://avatars4.githubusercontent.com/u/412903?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=RCopeland) |
:---: |:---: |:---: |:---: |:---: |:---: |
[Andy Hoffman](https://github.com/antibland) |[Marcus Crane](https://github.com/marcus-crane) |[Mike](https://github.com/mikeybyker) |[Mohit Garg](https://github.com/mohitgarg) |[Nadir](https://github.com/zero-t4) |[Rob Copeland](https://github.com/RCopeland) |

[<img alt="nechita" src="https://avatars5.githubusercontent.com/u/20286399?v=4&s=117" width="117">](https://github.com/wesbos/Learn-Node/commits?author=nechita) |
:---: |
[Gabriel Nechita](https://github.com/nechita) |
<!-- CONTRIBUTORS -->
