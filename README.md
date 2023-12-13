# CaSMM

> Computation and Science Modeling through Making

Cloud-based programming interface

![Deploy Staging](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Staging/badge.svg)
![Deploy Production](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Production/badge.svg)

<br/>

## Application

### `client` 
[client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

### `server`

[server](/server#server) is the web server and application server. It is powered by [Node](https://nodejs.org/en/) and [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html).

### `compile`

  [compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
#### Structure

The development environment is composed of five servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later four are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `casmm-client-dev` - localhost:3000

* `casmm-server-dev` - localhost:1337/admin

* `casmm-compile-dev` 

* `casmm-db-dev` - localhost:5432

  > The first time the db is started, the [init_db.sh](/scripts/init_db.sh) script will run and seed the database with an environment specific dump. Read about Postgres initialization scripts [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#initialization-scripts). To see how to create this dump, look [here](https://github.com/DavidMagda/CaSMM_fork_2023/blob/develop/scripts/readme.md).

* `casmm-compile_queue-dev`

#### Running

`casmm-client-dev`

1. Follow the [client](/client#setup) setup
2. Run `yarn install`, then `yarn start` from `/client`

`casmm-server-dev`, `casmm-compile-dev`, `casmm-db-dev`, and `casmm-compile_queue-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted
   

### Staging

#### Structure

The staging environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm-staging` - [casmm-staging.herokuapp.com](https://casmm-staging.herokuapp.com/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm-staging` is automatically built from the latest commits to branches matching `release/v[0-9].[0-9]`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm` - [www.casmm.org](https://www.casmm.org/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

<br/>

## Maintenance

All three components of the application have their own dependencies managed in their respective `package.json` files. Run `npm outdated` in each folder to see what packages have new releases. Before updating a package (especially new major versions), ensure that there are no breaking changes. Avoid updating all of the packages at once by running `npm update` because it could lead to breaking changes. 

### Strapi

This is by far the largest and most important dependency we have. Staying up to date with its [releases](https://github.com/strapi/strapi/releases) is important for bug/security fixes and new features. When it comes to actually upgrading Strapi make sure to follow the [migration guides](https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html#v3-guides)!

<br/>

## CI/CD

All of the deployments and releases are handled automatically with [GitHub Actions](https://docs.github.com/en/actions). The workflows implement custom [Actions](https://github.com/STEM-C/CaSMM/actions) that live in the [auto](https://github.com/STEM-C/auto) repo.

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, rebase the feature branch into the target branch to resolve any merge conflicts.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit

### TEAM 10E
- Features added
  - Lesson and unit creation for teachers
  ![Screenshot 2023-12-12 123725](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/55e079bc-7dca-4acf-8e62-3e0fe5c9c90f)
  - Classroom group making
  ![Screenshot 2023-12-12 123939](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/4f84822d-3339-4d20-9857-4975a250a076)
  - U/I enhancements
  ![Screenshot 2023-12-12 124121](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/8141268c-884c-4382-bc83-4440640ec9b3)
  ![Screenshot 2023-12-12 124834](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/17d6c98b-7285-4605-a622-c6d918819d5a)
  - Adding and removing students to classrooms
  ![Screenshot 2023-12-12 125100](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/f6b08c14-604a-4161-b8f6-2f5e47f9f87a)
  - Public lesson sharing and copying of public lessons
  ![Screenshot 2023-12-12 125221](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/c98576a1-2a1e-4fa5-b68b-a6fa341be79d)
  - Emoji password creation
  ![Screenshot 2023-12-12 125318](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/c093f5d5-2c2e-4852-99bc-29276ec5c7fb)
  - Activity and lesson deletion
  ![Screenshot 2023-12-12 125433](https://github.com/Team-10e/emerald-project17-10e/assets/92892486/9f1f8e2a-d211-4a46-9a41-baa0988e0bfd)
  
  Other than the steps above, yarn install in client must be run in order for the emoji password library to work correctly.

  For updating the database, the teacher manager role must be updated in order to find, delete, update, and create both units and lessons. The teacher manager must also be able to find grades in order for dropdowns to   
  work correctly. The lesson-module must to updated with fields for a boolean to store share data and then a text field for the big question and the unit must also be updated to contain the new duration text field.   
  Finally in order to have the group assignments work properly, a new number field for students must be made.

  - Outstanding Work
    - Lesson sharing bugs for some of the units
    - Edit lessons and units
    - Veiwing students progress from within roster








