import * as angular from 'angular';
import { FetchResult } from 'apollo-link';
import {
  ApolloClient,
  ApolloQueryResult,
  WatchQueryOptions,
  MutationOptions,
} from 'apollo-client';

import { TypedVariables } from './types';

export type R = Record<string, any>;

class Apollo {
  constructor(private client: ApolloClient<any>, private $q: any) {}

  public query<T, V = R>(
    options: WatchQueryOptions & TypedVariables<V>,
  ): angular.IPromise<ApolloQueryResult<T>> {
    this.check();

    return this.wrap(this.client.query<T>(options));
  }

  public mutate<T, V = R>(
    options: MutationOptions & TypedVariables<V>,
  ): angular.IPromise<FetchResult<T>> {
    this.check();

    return this.wrap(this.client.mutate<T>(options));
  }

  private check(): void {
    if (!this.client) {
      throw new Error('Client is missing. Use ApolloProvider.defaultClient');
    }
  }

  private wrap<R>(promise: Promise<R>): angular.IPromise<R> {
    return this.$q((resolve, reject) => {
      promise.then(resolve).catch(reject);
    });
  }
}

class ApolloProvider implements angular.IServiceProvider {
  private client: ApolloClient<any>;

  public $get = ['$q', $q => new Apollo(this.client, $q)];

  public defaultClient(client: ApolloClient<any>) {
    this.client = client;
  }
}

export default angular
  .module('angular-apollo', [])
  .provider('apollo', new ApolloProvider()).name;
