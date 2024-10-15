# Lovely Stay technical assessment

This is my presentation of the technical assessment regarding the github user application. For this application to run, you'll need some pre-requesites already installed:

- Docker
- Github Personal Access Token (https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
- Node

## Setup

After making sure you have the pre-requesites up and ready, please also make sure you drop all containers you have running to prevent port conflict (specially because database port default always use the same). To do so, you can follow the following commands:

> docker ps

This lists all the current dockers you have running

> docker stop <container_name>

(don't use "<" and ">" when running the command)

After this you're ready to init the database container by running:

> docker compose up --build -d

Now, if you run the "docker ps" you'll see your database up and running with the name "lovely_stay_database". We now need to fetch some information from this container in order to configure our application. For this, please run the following command:

> docker inspect lovely_stay_database | grep ort

And please take note of the result (probably 5432). Then do the same to fetch the container IP, like so:

> docker inspect lovely_stay_database | grep IP

With this 2 information you can configure the file located in config/config.json (there some values already in there that should have been loaded differently, like database user and password, but, for the sake of it, we gonna let it as it is).
You'll notice that on this file, there is also a property called "github_token". This is for you to put your own github token that you generate, without it, GITHUB api will not work.
Don't forget to also update the same database values on knexfile.cjs!

There is 2 more steps that we still need to do. Let us focus now in the database. We need to create the database manually (the migrations will do the rest). For that, first enter docker like so:

> docker exec -it lovely_stay_database bash

Now inside, please enter PostGreSQL like so:

> psql -p 5432 -U lovely_stay

Now, create database:

> create database lovely_stay;

To finish, go to project folder (.../lovely_ts) and run node packages install, like:

> npm install

For this, make sure you have node installed and version 20. You can easly achieve this with <b>nvm</b>

We can finally run the migrations and everthing up and running for the application, like so:

> npx knex migrate:latest --knexfile knexfile.cjs

## Documentation

This application needs basic inputs in order to achieve the goal. To start, we first need to compile the typescript, like so:

> npm run build

Please make sure it creates a /dist directory in the project. If it creates, it is now ready to run the various command options. This is organized by doing:

> node dist/src/index.js {action} {parameter} {parameter}...

This following table explains what actions are available and it's parameters:

| Description       | Action |         Parameters |                                                       Example |
| ----------------- | :----: | -----------------: | ------------------------------------------------------------: |
| Get Github User   |   -u   |           username |                                node dist/src/index.js -u test |
| Display All Users |   -d   | location(optional) | node dist/src/index.js -d (node dist/src/index.js -d "Porto") |
| Get user Langages |   -l   |           username |                                node dist/src/index.js -l test |

## Tests

I'm feeling short on time to keep on debugging this issue. I cannot make the tests run, it's probably regarding some configuration in the ts.config.json file but I already tried everything, specially using the latest versions of the mocha and chai. Maybe this is an issue of my know how in typescript because I never had this problem before.

> npm run test:unit