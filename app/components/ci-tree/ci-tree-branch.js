import Ember from 'ember';
import layout from '../../templates/components/ci-tree/ci-tree-branch';

export default Ember.Component.extend({
  /**
   * The model to render its children within this branch
   * this property is set during component markup creation
   */
  model: undefined,

  /**
   * A list of {{#crossLink "TreeNode"}}nodes{{/crossLink}} instances.
   */
  children: Ember.computed.alias('model.children'),

  /**
   * True if node's children should be loaded asynchronously
   * This gives the opportunity to the user to invoke an async call to the server to retrieve data for the current
   * branch being opened
   */
  async: false,
  tagName: 'ul',
  layoutName: layout,
  classNameBindings: ['styleClasses'],
  styleClasses: 'ci-tree-branch fa-ul'
});
