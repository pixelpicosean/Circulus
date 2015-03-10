import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.push('actor', { id: 1, name: 'Mario' });
    this.store.push('actor', { id: 2, name: 'Luigy' });

    return this.store.all('actor');
  }
});
