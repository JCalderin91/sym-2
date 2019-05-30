$(document).ready(function () {
$('#another').on('click', ()=>{
  location.reload();
})

  var conditions = ['time', 'request', 'service'];

  $('#stop-conditions').on('change', function (ev) {
    conditions.forEach((name) => {
      $(`#${name}`).addClass('d-none');
      $(`#${name} input`).val('');
    })
    let inputName = $(this).val();
    $(`#${inputName}`).removeClass('d-none');
  });

  $('#inicial-conditions').on('change', function (ev) {
    $('#inicial-conditions-box').toggleClass('d-none')
  })

  var results = []


  $('#begin').on('click', function () {
    var stop = {
      'condition': $('#stop-conditions').val(),
      'time': $('.stop_conditions').not('.d-none').find('input').val(),
    }

    if ($('#inicial-conditions')[0].checked) {
      var init = {
        'tr': 0,
        'eqo': '-',
        'ne': $('#entityInit').val(),
        'ri': 0,
        'eg': [],
        'le': []
      }
      if ($('#timeRequestInit').val() != '') {
        init.le.push({
          'e': 'E1',
          't': $('#timeRequestInit').val()
        })
      }
      if ($('#timeServiceInit').val() != '') {
        init.le.push({
          'e': 'E2',
          't': $('#timeServiceInit').val()
        })
      }
      if (stop.condition == 'time') {
        init.le.push({
          'e': 'E3',
          't': stop.time
        })
      }
      results.push(init)
    }

    console.log(stop)
    console.log(results)

    let template, subTemplate, aux;

    results.forEach(function (item, iteration) {
      template = '';
      subTemplate = '';
      aux = '';
      item.le.forEach(function (el, key) {
        subTemplate += `<span>${el.e}/${el.t} seg</span>`;
        if (item.le.length != (key + 1)) {
          subTemplate += `, `;
        }
        console.log(key);
      })

      if (item.eg.length > 0) {
        aux = `${item.eg.e}/${item.eg.t}`;
      } else {
        aux = '-'
      }

      template += `<tr>
        <td>${iteration+1}</td>
        <td>${item.tr}</td>
        <td>${item.eqo}</td>
        <td>${item.ne}</td>
        <td>${item.ri}</td>
        <td>${aux}</td>
        <td>${subTemplate}</td>
      </tr>`
      $('#resultsBody').html(template)
    })

  });


  //Nota 4




});