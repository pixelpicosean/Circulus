import CiTreeNode from './ci-tree-node';

export default CiTreeNode.extend({
    type: function() {
        switch (this.get('node.type')) {
            case 'sprite':
                return 'image';
            case 'animation':
                return 'film';
            default:
                return 'question';
        }
    }.property()
});
