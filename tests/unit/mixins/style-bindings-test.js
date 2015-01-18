import Ember from 'ember';
import StyleBindingsMixin from 'circulus/mixins/style-bindings';

module('StyleBindingsMixin');

// Replace this with your real tests.
test('it works', function() {
  var StyleBindingsObject = Ember.Object.extend(StyleBindingsMixin);
  var subject = StyleBindingsObject.create();
  ok(subject);
});
