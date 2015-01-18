import Ember from 'ember';
import WithConfigMixin from 'circulus/mixins/with-config';

module('WithConfigMixin');

// Replace this with your real tests.
test('it works', function() {
  var WithConfigObject = Ember.Object.extend(WithConfigMixin);
  var subject = WithConfigObject.create();
  ok(subject);
});
