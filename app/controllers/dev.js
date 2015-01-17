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

        var family = Ember.EC.TreeNode.create({title: 'Family'})
        // 1st level
        var suz = family.createChild({title: 'Susan'})
        var lud = family.createChild({title: 'Luda'})

        // 2nd level
        var josh = suz.createChild({title: 'Josh'})
        var moses = suz.createChild({title: 'Moses'})
        var verdi = lud.createChild({title: 'Verdi'})
        var gaya = lud.createChild({title: 'Gaya'})

        this.set('model', family);
    }
});
