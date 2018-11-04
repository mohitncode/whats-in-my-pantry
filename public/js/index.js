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
    success: function (success) {
      console.log(success);
    },
    error: function (err) {
      console.err(err);
    }
  });
});