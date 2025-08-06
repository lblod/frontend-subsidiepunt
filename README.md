# frontend-subsidiepunt

Frontend of the subsidiepunt application

## Environment variables

The [ember-proxy-service](https://github.com/mu-semtech/ember-proxy-service#configure-environment-variables-in-the-frontends-container) docker image (which we use to host the frontend) supports configuring environment variables. The following options are available.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

| Name                                       | Description                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `EMBER_GLOBAL_SYSTEM_NOTIFICATION`         | This can be used to display a message at the top of the application. HTML is supported. |

- `git clone <repository-url>` this repository
- `cd frontend-subsidiepunt`
- `npm install`

| Name                               | Description                                                                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EMBER_ACMIDM_CLIENT_ID`           | The unique client id for a specific environment                                                                                                          |
| `EMBER_ACMIDM_AUTH_URL`            | The URL where users will be redirected to when they want to log in                                                                                       |
| `EMBER_ACMIDM_AUTH_REDIRECT_URL`   | The callback URL that ACM/IDM will use after the user logs in successfully                                                                               |
| `EMBER_ACMIDM_LOGOUT_URL`          | The URL where users will be redirected to when they want to log out                                                                                      |
| `EMBER_ACMIDM_SWITCH_REDIRECT_URL` | The URL that will be used when "switching users" is enabled in ACM/IDM. After logout, users can select one of their other accounts to simplify the flow. |

- `npm run start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Feature flags

Feature flags are new / experimental features that can be enabled by setting them to "true".

> There are no feature flags available right now.

- `npm run test`
- `npm run test:ember -- --server`

| Name                         | Description                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `EMBER_ANALYTICS_API_HOST`   | The URL of the Plausible host to which all events will be sent                   |
| `EMBER_ANALYTICS_APP_DOMAIN` | The app domain which will be used to group the events in the Plausible dashboard |

- `npm run lint`
- `npm run lint:fix`

### Sentry

- `npm exec ember build` (development)
- `npm run build` (production)

## Releasing a new version

We use [`release-it`](https://github.com/release-it/release-it) to handle our release flow 

### Generating the changelog (optional)
At the moment the changelog is updated manually. To make this a bit easier you can generate a basic changelog based on the merged PRs with [`lerna-changelog`](https://github.com/lerna/lerna-changelog) by  adding the correct labels and updating the PR titles.

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

The following command can  be used to generate the changelog:

`GITHUB_AUTH=your-access-token npx lerna-changelog`

### Creating a new release
Simply run `npm run release` and follow the prompts.

> If you generated the changelog using lerna-changelog you can add it to the changelog file and add it to the staged changes when release-it asks if you want to commit the changes. This will ensure that the changelog change is part of the release commit.

After the new tag is created and pushed CI will take care of building the docker image.
