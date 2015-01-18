import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        expand: function() {
            this.get('selected').toggleProperty('expanded');
            return null;
        }
    },
    init: function() {
        this._super();
    }
});
