import { ApolloQueryResult } from 'apollo-client';
import { rxify } from 'apollo-client-rxjs';
import { Observable } from 'rxjs/Observable';

import ApolloClient from 'apollo-client';
import * as angular from 'angular';

import 'rxjs/add/observable/from';

import { ApolloQueryObservable } from './ApolloQueryObservable';

export class Apollo {
  constructor(
    private client: ApolloClient, 
    private $q: any
  ) {}

  public query<T>(options: any): angular.IPromise<ApolloQueryResult<T>> {
    this.check();

    return this.wrap(this.client.query<T>(options));
  }

  public watchQuery<T>(options: any): ApolloQueryObservable<ApolloQueryResult<T>> {
    this.check();

    return new ApolloQueryObservable(rxify(this.client.watchQuery)(options));
  } 

  public mutate<T>(options: any): angular.IPromise<ApolloQueryResult<T>> {
    this.check();
    
    return this.wrap(this.client.mutate<T>(options));
  }

  public subscribe(options: any): Observable<any> {
    if (typeof this.client.subscribe === 'undefined') {
      throw new Error(`Your version of ApolloClient doesn't support subscriptions`);
    }

    return Observable.from(this.client.subscribe(options));
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

export class ApolloProvider implements angular.IServiceProvider {
  private client: ApolloClient;
  
  public $get = ['$q', ($q) => new Apollo(this.client, $q)];
  
  public defaultClient(client: ApolloClient) {
    this.client = client;
  }
}

export default angular.module(name, [])
  .provider('apollo', new ApolloProvider).name;
