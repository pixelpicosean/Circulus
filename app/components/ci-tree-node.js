import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['tree-node'],

    isExpanded: false,

    actions: {
        toggle: function() {
            this.toggleProperty('isExpanded');
        },
        didClick: function() {
            alert('You clicked: ' + this.get('node.text'));
        }
    }
});
