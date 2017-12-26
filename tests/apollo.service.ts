import * as angular from 'angular';
import 'angular-mocks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import ApolloModule from '../src';
import { mockSingleLink } from './mocks/mockLinks';

const testQuery = gql`
  query getFoo {
    foo {
      value
      __typename
    }
  }
`;

const testMutation = gql`
  mutation setFoo {
    foo {
      value
      __typename
    }
  }
`;

const result = {
  data: {
    foo: {
      value: 42,
      __typename: 'Foo',
    },
  },
};

describe('Apollo Service', () => {
  let client: ApolloClient<any>;

  beforeEach(() => {
    client = new ApolloClient({
      link: mockSingleLink(
        {
          request: {
            query: testQuery,
          },
          result,
        },
        {
          request: {
            query: testMutation,
          },
          result,
        },
      ),
      cache: new InMemoryCache(),
    });

    angular
      .module('testServiceModule', [ApolloModule])
      .config(apolloProvider => {
        apolloProvider.defaultClient(client);
      })
      .component('testApollo', {
        template: `
          <div data-test="value">{{$ctrl.foo}}</div>
          <button data-test="query" ng-click="$ctrl.query()">Query</button>
          <button data-test="mutate" ng-click="$ctrl.mutate()">Mutate</button>
        `,
        controller: function(apollo) {
          this.foo = 0;

          const handle = promise => {
            promise.then(
              result => {
                this.foo = result.data.foo.value;
              },
              error => {
                throw error;
              },
            );
          };

          this.query = () => {
            handle(
              apollo.query({
                query: testQuery,
              }),
            );
          };

          this.mutate = () => {
            handle(
              apollo.mutate({
                mutation: testMutation,
              }),
            );
          };
        },
      });
  });
  beforeEach(angular.mock.module('testServiceModule'));

  describe('integration', () => {
    let $compile;
    let $rootScope;

    beforeEach(
      angular.mock.inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      }),
    );

    it('should query results and update UI', done => {
      const element = $compile('<test-apollo></test-apollo>')($rootScope);

      $rootScope.$digest();

      const testValue = element[0].querySelector('[data-test="value"]');
      const testAction = element[0].querySelector('[data-test="query"]');

      expect(testValue.innerHTML).toEqual('0');

      testAction.click();

      setTimeout(() => {
        $rootScope.$digest();
        expect(testValue.innerHTML).toEqual('42');
        done();
      });
    });

    it('should do mutation and update UI', done => {
      const element = $compile('<test-apollo></test-apollo>')($rootScope);

      $rootScope.$digest();

      const testValue = element[0].querySelector('[data-test="value"]');
      const testAction = element[0].querySelector('[data-test="mutate"]');

      expect(testValue.innerHTML).toEqual('0');

      testAction.click();

      setTimeout(() => {
        $rootScope.$digest();
        expect(testValue.innerHTML).toEqual('42');
        done();
      });
    });
  });
});
