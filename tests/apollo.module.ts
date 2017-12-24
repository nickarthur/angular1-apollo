import 'angular';
import 'angular-mocks';

import Apollo from '../src';

describe('Apollo Module', () => {
  it('should be named angular-apollo', () => {
    expect(Apollo).toEqual('angular-apollo');
  });
});
