'use strict';
$('#foodfinder').on('click', function (e) {
  let ingredients = $('#ingredients').tagsinput('items');
  console.log(ingredients);
});