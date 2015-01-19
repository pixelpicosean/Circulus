import CiTreeNode from './ci-tree-node';

export default CiTreeNode.extend({
    type: function() {
        switch (this.get('node.type')) {
            case 'sprite':
                return 'image';
                break;
            case 'animation':
                return 'film';
                break;
            default:
                return 'question';
        }
    }.property()
});
