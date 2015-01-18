import Ember from 'ember';

export default Ember.Controller.extend({
  treeRoot: function() {
    return {
      text: 'Root',
      children: [
        {
          text: 'People',
          children: [
            {
              text: 'Basketball players',
              children: [
                {
                  text: 'LeBron James',
                  children: []
                },
                {
                  text: 'Kobe Bryant',
                  children: []
                }
              ]
            },
            {
              text: 'Astronauts',
              children: [
                {
                  text: 'Neil Armstrong',
                  children: []
                },
                {
                  text: 'Yuri Gagarin',
                  children: []
                }
              ]
            }
          ]
        },
        {
          text: 'Fruits',
          children: [
            {
              text: 'Banana',
              children: []
            },
            {
              text: 'Pineapple',
              children: []
            },
            {
              text: 'Orange',
              children: []
            }
          ]
        },
        {
          text: 'Clothes',
          children: [
            {
              text: 'Women',
              children: [
                {
                  text: 'Dresses',
                  children: []
                },
                {
                  text: 'Tops',
                  children: []
                }
              ]
            },
            {
              text: 'Men',
              children: [
                {
                  text: 'Jeans',
                  children: []
                },
                {
                  text: 'Shirts',
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
