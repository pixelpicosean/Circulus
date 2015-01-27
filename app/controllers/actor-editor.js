import Ember from 'ember';

export default Ember.Controller.extend({
    selected: null,
    actions: {
        toggleVisibility: function(node, currVisible) {
            console.log('%s "%s"', (currVisible ? 'hide' : 'show'), node.name);
            Ember.set(node, 'visible', !currVisible);
        }
    },
    treeRoot: function() {
        return {
            name: 'Root',
            visible: true,
            type: 'sprite',
            children: [
                {
                    name: 'People',
                    visible: true,
                    type: 'sprite',
                    children: [
                        {
                            name: 'Basketball players',
                            visible: true,
                            type: 'animation',
                            children: [
                                {
                                    name: 'LeBron James',
                                    visible: true,
                                    type: 'animation',
                                    children: []
                                },
                                {
                                    name: 'Kobe Bryant',
                                    visible: true,
                                    type: 'animation',
                                    children: []
                                }
                            ]
                        },
                        {
                            name: 'Astronauts',
                            visible: true,
                            type: 'sprite',
                            children: [
                                {
                                    name: 'Neil Armstrong',
                                    visible: true,
                                    type: 'sprite',
                                    children: []
                                },
                                {
                                    name: 'Yuri Gagarin',
                                    visible: true,
                                    type: 'animation',
                                    children: []
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'Fruits',
                    visible: true,
                    type: 'sprite',
                    children: [
                        {
                            name: 'Banana',
                            visible: true,
                            type: 'animation',
                            children: []
                        },
                        {
                            name: 'Pineapple',
                            visible: true,
                            type: 'animation',
                            children: []
                        },
                        {
                            name: 'Orange',
                            visible: true,
                            type: 'sprite',
                            children: []
                        }
                    ]
                },
                {
                    name: 'Clothes',
                    visible: true,
                    type: 'sprite',
                    children: [
                        {
                            name: 'Women',
                            visible: true,
                            type: 'sprite',
                            children: [
                                {
                                    name: 'Dresses',
                                    visible: true,
                                    type: 'animation',
                                    children: []
                                },
                                {
                                    name: 'Tops',
                                    visible: true,
                                    type: 'sprite',
                                    children: []
                                }
                            ]
                        },
                        {
                            name: 'Men',
                            visible: true,
                            type: 'animation',
                            children: [
                                {
                                    name: 'Jeans',
                                    visible: true,
                                    type: 'sprite',
                                    children: []
                                },
                                {
                                    name: 'Shirts',
                                    visible: true,
                                    type: 'animation',
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }.property()
});
