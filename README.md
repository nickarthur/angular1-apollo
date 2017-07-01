# angular1-apollo

[![npm version](https://badge.fury.io/js/angular1-apollo.svg)](https://badge.fury.io/js/angular1-apollo)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollostack.com/#slack)
[![bitHound Overall Score](https://www.bithound.io/github/apollostack/angular1-apollo/badges/score.svg)](https://www.bithound.io/github/apollostack/angular1-apollo)

Use your GraphQL server data in your Angular 1.0 app, with the [Apollo Client](https://github.com/apollostack/apollo-client).

- [Install](#install)
- [Development](#development)

## Install

```bash
npm install angular1-apollo apollo-client --save
```

## API

```ts
angular.module('app', [
  'angular-apollo'
])
```

### Default client
#### ApolloProvider.defaultClient


```ts
import AngularApollo from 'angular1-apollo'
import ApolloClient from 'apollo-client';

angular.module('app', [
  AngularApollo
]).config((apolloProvider) => {
  const client = new ApolloClient();

  apolloProvider.defaultClient(client);
});
```

### Queries
#### Apollo.query(options): Promise<ApolloQueryResult>

[See documentation](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.query)

```ts
import gql from 'graphql-tag';

angular.module('app')
  .controller('AppCtrl', (apollo) => {
    apollo.query({
      query: gql`
        query getHeroes {
          heroes {
            name
            power
          }
        }
      `
    }).then(result => {
      console.log('got data', result);
    });
  });
```

### Mutations
#### Apollo.mutate(options): Promise<ApolloQueryResult>

[See documentation](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient\.mutate)

```ts
import gql from 'graphql-tag';

angular.module('app')
  .controller('AppCtrl', (apollo) => {
    apollo.mutate({
      mutation: gql`
        mutation newHero($name: String!) {
          addHero(name: $name) {
            power
          }
        }
      `,
      variables: {
        name: 'Batman'
      }
    }).then(result => {
      console.log('got data', result);
    });
  });
```

## Development

This project uses TypeScript for static typing and TSLint for linting. You can get both of these built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
