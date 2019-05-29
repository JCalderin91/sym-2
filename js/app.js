$(document).ready(function(){
  var conditions = ['time', 'request','service'];

  $('#stop-conditions').on('change', function(ev){
    conditions.forEach((name)=>{
      $(`#${name}`).addClass('d-none');
      $(`#${name} input`).val('');
    })
    let inputName = $(this).val();
    $(`#${inputName}`).removeClass('d-none');
  });

  $('#inicial-conditions').on('change', function(ev){
    $('#inicial-conditions-box').toggleClass('d-none')
  })
});