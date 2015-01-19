import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['tree-node'],

    isExpanded: false,
    selected: null,

    actions: {
        toggle: function() {
            this.toggleProperty('isExpanded');
        },
        select: function(obj) {
            this.set('selected', obj);
        }
    }
});
