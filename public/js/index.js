'use strict';
$('#foodfinder').on('click', function (e) {
  let ingredients = $('#ingredients').tagsinput('items');
  console.log(ingredients);

  $.ajax({
    url: '/',
    method: 'POST',
    data: {
      "ingredients": ingredients
    },
    success: function (data) {
      try {
        let recipe = JSON.parse(data);
        let links = recipe['_links'];
        let recipeLink = null;
        for (let i = 0; i < links.length; i++) {
          if (links[i]['rel'] == 'web') {
            recipeLink = links[i];
            break;
          }
        }
        // console.log(recipeLink['href']);
        location.href = recipeLink['href'];
      } catch (err) {
        console.warn(err);
      }
    },
    error: function (err) {
      console.error(err);
    }
  });
});