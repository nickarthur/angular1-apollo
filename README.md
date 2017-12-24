# angular1-apollo

[![npm version](https://badge.fury.io/js/angular1-apollo.svg)](https://badge.fury.io/js/angular1-apollo)
[![Get on Slack](https://img.shields.io/badge/slack-join-orange.svg)](http://www.apollographql.com/#slack)
[![bitHound Overall Score](https://www.bithound.io/github/apollographql/angular1-apollo/badges/score.svg)](https://www.bithound.io/github/apollographql/angular1-apollo)

Use your GraphQL server data in your Angular 1.0 app, with the [Apollo Client](https://github.com/apollographql/apollo-client).

* [Install](#install)
* [Development](#development)

## Install

```bash
npm install angular1-apollo apollo-client --save
```

## API

```ts
angular.module('app', ['angular-apollo']);
```

### Default client

#### ApolloProvider.defaultClient

```ts
import AngularApollo from 'angular1-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

angular.module('app', [AngularApollo]).config(apolloProvider => {
  const client = new ApolloClient({
    link: HttpLink.create(...),
    cache: new InMemoryCache(...),
  });

  apolloProvider.defaultClient(client);
});
```

### Queries

#### Apollo.query(options): Promise<ApolloQueryResult>

[See documentation](https://www.apollographql.com/docs/react/reference/index.html#ApolloClient.query)

```ts
import gql from 'graphql-tag';

angular.module('app').controller('AppCtrl', apollo => {
  apollo
    .query({
      query: gql`
        query getHeroes {
          heroes {
            name
            power
          }
        }
      `,
    })
    .then(result => {
      console.log('got data', result);
    });
});
```

### Mutations

#### Apollo.mutate(options): Promise<ApolloQueryResult>

[See documentation](https://www.apollographql.com/docs/react/reference/index.html#ApolloClient.mutate)

```ts
import gql from 'graphql-tag';

angular.module('app').controller('AppCtrl', apollo => {
  apollo
    .mutate({
      mutation: gql`
        mutation newHero($name: String!) {
          addHero(name: $name) {
            power
          }
        }
      `,
      variables: {
        name: 'Batman',
      },
    })
    .then(result => {
      console.log('got data', result);
    });
});
```

### Static Typing

As your application grows, you may find it helpful to include a type system to assist in development. Apollo supports type definitions for TypeScript system. Both `apollo-client` and `angular1-apollo` ship with definitions in their npm packages, so installation should be done for you after the libraries are included in your project.

##### Operation result

The most common need when using type systems with GraphQL is to type the results of an operation. Given that a GraphQL server's schema is strongly typed, we can even generate TypeScript definitions automatically using a tool like [apollo-codegen](https://github.com/apollographql/apollo-codegen). In these docs however, we will be writing result types manually.

Since the result of a query will be sent to the component or service, we want to be able to tell our type system the shape of it. Here is an example setting types for an operation using TypeScript:

```ts
type Hero = {
  name: string;
  power: string;
};

type Response = {
  heros: Hero[];
};

angular.module('app').controller('AppCtrl', apollo => {
  apollo
    .query<Response>({
      query: gql`
        query getHeroes {
          heroes {
            name
            power
          }
        }
      `,
    })
    .then(result => {
      console.log(result.data.heroes); // no TypeScript errors
    });
});
```

Without specyfing a Generic Type for `Apollo.query`, TypeScript would throw an error saying that `hero` property does not exist in `result.data` object (it is an `Object` by default).

#### Options

To make integration between Apollo and Angular even more statically typed you can define the shape of variables (in query, watchQuery and mutate methods).
Here is an example setting the type of variables:

```ts
type Hero = {
  name: string;
  power: string;
};

type Response = {
  hero: Hero;
};

type Variables = {
  name: string;
};

angular.module('app').controller('AppCtrl', apollo => {
  apollo
    .query<Response, Variables>({
      mutation: gql`
        query getHero($name: String!) {
          hero(name: $name) {
            name
            power
          }
        }
      `,
      variables: {
        name: 'Batman',
        appearsIn: 'Star Wars', // will throw an error because `appearsIn` does not exist
      },
    })
    .then(result => {
      console.log(result.data.hero); // won't throw an issue
    });
});
```

## Development

This project uses TypeScript for static typing and TSLint for linting. You can get both of these built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
