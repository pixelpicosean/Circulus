import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.push('actor', { id: 1, name: 'World' });
    this.store.push('sprite', { id: 2, name: 'Mario', alpha: 0.6 });

    return this.store.all('actor');
  }
});
