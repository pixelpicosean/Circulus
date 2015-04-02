import Ember from 'ember';
import StyleBindingsMixin from '../../../mixins/style-bindings';
import { module, test } from 'qunit';

module('StyleBindingsMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var StyleBindingsObject = Ember.Object.extend(StyleBindingsMixin);
  var subject = StyleBindingsObject.create();
  assert.ok(subject);
});
