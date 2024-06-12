<p align="center">
  <img src="https://github.com/timmchi/kinology-movie-app/blob/main/assets/kinology-logo.png" width="400" alt="logo"/>
</p>

---

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

![Test and deploy to production workflow](https://github.com/timmchi/kinology-movie-app/actions/workflows/pipeline.yml/badge.svg)
![Healthcheck](https://github.com/timmchi/kinology-movie-app/actions/workflows/healthcheck.yml/badge.svg)

## Table of Contents

1. [What is this app?](#what-is-this-app)
2. [Installation](#installation)
3. [Build](#build)
4. [Tests](#tests)
5. [Env variables](#env-variables)
6. [Github actions](#github-actions)
7. [TMDB api](#tmdb)
8. [Fullstack open](#fso)

## <a name="what-is-this-app">What is this app?</a>

Kinology is a web app that helps you decide which movie you should watch. You can search for movies based genre, year of release, actor, rating and other parameters, greatly simplifying choosing what to watch this evening.

You can also create your own account, to which you can then add movies you've already seen, your favorite movies or movies you would like to watch. And you can also comment on movies and other users' profiles.

The frontend for the app was built with React, with a lot of styling based on MUI components, and it is responsive and mobile friendly. Backend was built with Node and it utilizes MongoDB to store data.

You can check out the production version of Kinology [here](https://kinology-movie-app.onrender.com/)

[Link](https://github.com/timmchi/kinology-movie-app/blob/main/timekeeping.md) to the timekeeping document.

## <a name="installation">Installation</a>

In order to run this app on your machine, you will need to have Node, Vite and npm installed.

Then after cloning the repository, install the frontend dependencies by running:

```bash
# Change to frontend directory
cd kinology_frontend

# Install dependencies
npm install

# Run the frontend in development mode
npm run dev
```

Then, go back to the root of the project, and install backend dependencies by running:

```bash
# Change to backend directory
cd kinology_backend

# Install dependencies
npm install

#Run the backend in development mode
npm run dev
```

The above commands will start the app in development mode, and will watch out for changes in code.

## <a name="build">Build</a>

In order to build the application, change to kinology_backend directory `cd kinology_frontend` and run:

```bash
# Build the app
npm run build:ui

# Start app in production mode
npm run start
```

## <a name="tests">Tests</a>

There are currently 220 tests in total. 91 Frontend unit tests, 75 backend integration tests, and 54 e2e tests.

### Unit tests

Frontend components are tested using unit tests using vitest and react testing library. To run them, change to kinology_frontend directory `cd kinology_frontend` and run:

```
npm test
```

### Integration tests

Backend apis are tested using integration tests. To run them, change to kinology_backend directory and run the following command:

```bash
npm test -- ./tests/comments_api.test.js &&
npm test -- ./tests/login_api.test.js &&
npm test -- ./tests/movies_api.test.js &&
npm test -- ./tests/users_api.test.js
```

or, alternatively, you can run the above commands one after the other. Unfortunately, as the tests use the database, they crash when executing them in parallel, hence why `npm test` is not an option here. Additionally, refrain from running backend tests and e2e tests at the same time, as due to database usage there will be conflicts. Same goes for running tests locally at the same time as github actions. A fix might be coming in the future.

### E2E Tests

E2E tests were built using Playwright and the code is available in the root directory in tests folder.

You can run e2e tests by running the following command in project directory:

```bash
npm run test:e2e
```

If you would like to run e2e tests with ui, run the following command in project directory:

```bash
npm test -- ./tests/refactoredSpecs --ui
```

Github actions uses test file CI_kinology.spec.js, however, while running tests locally I recommend using the folder refactoredSpecs inside the tests directory. It contains the same tests as the CI_kinology.spec.js, but refactored into separate smaller specs. Unfortunately, at the moment of writing, refactored specs are failing in github actions, and due to the fact that my account is currently very close to limit of Github actions, I am unable to do enough trial and error to get Github actions to work with refactored e2e tests. This is the reason for this workaround. A fix is possibly coming in the future once the limits for github actions resets.

## <a name="env-variables">Env variables</a>

If you want to run the project locally, you will need to create a .env file in kinology_backend directory.

Environment variables used in this project are the following:

|          Name           |               Description               |                            More info                            |
| :---------------------: | :-------------------------------------: | :-------------------------------------------------------------: |
|         `PORT`          | Port on which the API will be available |                        Defaults to 3001                         |
|   `PROD_MONGODB_URI`    |   MongoDB database URL in production    |                                                                 |
|    `DEV_MONGODB_URI`    |   MongoDB database URL in development   |                                                                 |
|   `TEST_MONGODB_URI`    |     MongoDB database URL in testing     |                                                                 |
|        `SECRET`         |    Secret used in JWT token encoding    |                                                                 |
|      `TMDB_TOKEN`       |           Token for TMDB api            |  [Link](https://developer.themoviedb.org/docs/getting-started)  |
|     `TMDB_API_KEY`      |          API key for TMDB api           |                                                                 |
|      `BUCKET_NAME`      |             AWS bucket name             |                                                                 |
|     `BUCKET_REGION`     |            AWS bucket region            |                                                                 |
|    `AWS_ACCESS_KEY`     |           Your AWS access key           |                                                                 |
| `AWS_SECRET_ACCESS_KEY` |       Your AWS secret access key        |                                                                 |
|     `ETHEREAL_USER`     |   Username for ethereal email service   |                 [Link](https://ethereal.email/)                 |
|      `ETHEREAL_PW`      |   Password for ethereal email service   |                                                                 |
|      `GMAIL_USER`       |  Gmail email you wish to use for email  |                                                                 |
|       `GMAIL_PW`        |   App password for your gmail account   | [Link](https://support.google.com/accounts/answer/185833?hl=en) |

## <a name="github-actions">Github actions</a>

Kinology uses **Github Actions** to automate various tasks.

Workflows are available in the **[.github/workflows directory](https://github.com/timmchi/kinology-movie-app/tree/main/.github/workflows).**

### Workflows

|                                                       Name                                                        |                                                                               Description and Status                                                                                |
| :---------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **[Deployment pipeline](https://github.com/timmchi/kinology-movie-app/tree/main/.github/workflows/pipeline.yml)** | Includes building, linting, tests and deployment to Render.</br></br>![Deployment pipeline](https://github.com/timmchi/kinology-movie-app/actions/workflows/pipeline.yml/badge.svg) |
|   **[Healthcheck](https://github.com/timmchi/kinology-movie-app/tree/main/.github/workflows/healthcheck.yml)**    |     Checks if the app is running and available on Render. </br></br> ![Healthcheck](https://github.com/timmchi/kinology-movie-app/actions/workflows/healthcheck.yml/badge.svg)      |

## <a name="tmdb">TMDB api</a>

Kinology uses [TMDB api](https://www.themoviedb.org) to implement movie searching functionality. Big thanks for the awesome api and easy to understand documentation!

## <a name="fso">Fullstack open</a>

This project is my submission for Fullstack project, worth 10 credits. I completed it as a part of the [Fullstackopen course](https://fullstackopen.com/en/).
