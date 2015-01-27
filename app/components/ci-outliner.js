import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * Root object
     */
    root: null,
    /**
     * Delegate that handles actions
     * @type {Controller|Route}
     */
    delegate: null
});
