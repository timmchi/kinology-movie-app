# Kinology

## Table of Contents

1. [What is this app?](#what-is-this-app)
2. [Installation](#installation)
3. [Build](#build)
4. [Tests](#tests)
5. [Docker](#docker)
6. [Env variables](#env-variables)
7. [Github actions](#github-actions)
8. [TMDB api](#tmdb)
9. [Fullstack open](#fso)

## <a name="what-is-this-app">What is this app?</a>

You can check out the production version of Kinology [here](https://kinology-movie-app.onrender.com/)

## <a name="installation">Installation</a>

## <a name="build">Build</a>

In order to build the application, run the following command in kinology_backend directory:

```
#Build the app
npm run build:ui

#Start app in production mode
npm run start
```

App can also be run in production mode with Docker, for more info go here **[Docker](#docker)**

## <a name="tests">Tests</a>

### Unit tests

Frontend components are tested using unit tests. To run them, change to kinology_frontend directory and run:

```
npm test
```

### Integration tests

Backend apis are tested using integration tests. To run them, change to kinology_backend directory and run:

```
npm test
```

### E2E Tests

E2E tests were built using Playwright and they code is available in the root directory in tests folder

You can run e2e tests by running the following command in project directory:

```
npm run test:e2e
```

If you would like to run e2e tests with ui, run the following command in project directory:

```
npm run test -- --ui
```

## <a name="docker">Docker</a>

## <a name="env-variables">Env variables</a>

If you want to run the project locally, you will need to create a .env file in kinology_backend directory.

Environment variables used in this project are the following:

|          Name           |               Description               |
| :---------------------: | :-------------------------------------: |
|         `PORT`          | Port on which the API will be available |
|   `PROD_MONGODB_URI`    |   MongoDB database URL in production    |
|    `DEV_MONGODB_URI`    |   MongoDB database URL in development   |
|   `TEST_MONGODB_URI`    |     MongoDB database URL in testing     |
|        `SECRET`         |    Secret used in JWT token encoding    |
|      `TMDB_TOKEN`       |           Token for TMDB api            |
|     `TMDB_API_KEY`      |          API key for TMDB api           |
|      `BUCKET_NAME`      |             AWS bucket name             |
|     `BUCKET_REGION`     |            AWS bucket region            |
|    `AWS_ACCESS_KEY`     |           Your AWS access key           |
| `AWS_SECRET_ACCESS_KEY` |       Your AWS secret access key        |
|     `ETHEREAL_USER`     |   Username for ethereal email service   |
|      `ETHEREAL_PW`      |   Password for ethereal email service   |
|      `GMAIL_USER`       |  Gmail email you wish to use for email  |
|       `GMAIL_PW`        |     App key from your gmail account     |

## <a name="github-actions">Github actions</a>

## <a name="tmdb">TMDB api</a>

## <a name="fso">Fullstack open</a>

```

```
