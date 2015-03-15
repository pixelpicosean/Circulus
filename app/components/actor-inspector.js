import Ember from 'ember';
import layout from '../templates/components/actor-inspector';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['actor-inspector'],

  /**
   * Delegate controller which will receive actions (delete/toggle...)
   * @type {Em.ObjectController}
   */
  delegate: null,
});
