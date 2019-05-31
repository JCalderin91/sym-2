//Cuando el documento este cargafo ejecutar
$(document).ready(function () {
//Cuando se haga click en el boton para reiniciar

  function generateEventIn(pseudo) {
    return (-5 * Math.log(pseudo)).toFixed(2)
  }
  function generateEventService(pseudo) {
    return (-7.5 * Math.log(pseudo)).toFixed(2)
  }


  $('#another').on('click', ()=>{
    //se hace un recorrido de todos los imputs
    $('input[type="text"], input[type="number"] ').each(function() {
      //y se vacian
      $(this)[0].value = '';
    })
    // y se recarga el documento
    location.reload();
  })

  // arreglo de nombre de codiciones finales para facilitar el recorrido
  var conditions = ['time', 'request', 'service'];
  // cuando se cambie el tipo de condicion final
  $('#stop-conditions').on('change', function (ev) {
    // se recorre el arreglo de nombres
    conditions.forEach((name) => {
      //se ocultan los que no se seleccionan
      $(`#${name}`).addClass('d-none');
      //y se dejan en blanxo
      $(`#${name} input`).val('');
    })
    let inputName = $(this).val();
    $(`#${inputName}`).removeClass('d-none');
  });

  $('#inicial-conditions').on('change', function (ev) {
    $('#inicial-conditions-box').toggleClass('d-none')
  })


  var results = []
  var inPatter = [];
  var servicePatter = [];
  var init = [];

  $('#begin').on('click', function () {
    results = []

    var stop = {
      'condition': $('#stop-conditions').val(),
      'value': $('.stop_conditions').not('.d-none').find('input').val(),
    }

    
    init = {
      'tr': 0,
      'eqo': '-',
      'ne': 0,
      'ri': 0,
      'eg': [],
      'le': []
    }
    results.push(init)

    if(results[results.length-1].le.length == 0){
      let pseudo = Math.random()
      let t = generateEventIn(pseudo);

      inPatter.push(t)

      init = {
        'tr': t,
        'eqo': 'E1',
        'ne': results[results.length-1].ne + 1,
        'ri': pseudo.toFixed(3),
        'eg': [{
          'e': 'E1',
          't': t
        }],
        'le': [{
          'e' : 'E1',
          't' : t
        }]
      }
      results.push(init)
    }

    if(results[results.length-1].le.length > 0){
      let pseudo = Math.random()
      let t = generateEventService(pseudo);

      servicePatter.push(t)

      init = {
        'tr': results[results.length-1].tr,
        'eqo': 'E2',
        'ne': results[results.length-1].ne,
        'ri': pseudo.toFixed(3),
        'eg': [{
          'e': 'E2',
          't': t
        }],
        'le': [results[results.length-1].le[0],{
          'e' : 'E2',
          't' : t
        }]
      }
      results.push(init)
    }


   var respuestas = verify__results(results, inPatter, servicePatter)
   let template, subTemplate, aux;
   template = '';

   respuestas.forEach(function(item) {
     template += `<li class="list-item-group">${item.title}: ${item.value}</li>`
   })

   $('#respuestas').html(template)

    template = '';
    subTemplate = '';
    aux = '';

    results.forEach(function (item, iteration) {
      item.le.forEach(function (el, key) {
        subTemplate += `<span>${el.e}/${el.t} seg</span>`;
        if (item.le.length != (key + 1)) {
          subTemplate += `, `;
        }
        //console.log(key);
      })

      if (item.eg.length > 0) {
        aux = `${item.eg[0].e}/${item.eg[0].t}`;
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
  function verify__results(results, inPatter, servicePatter) {
    var response = []
     //1
    response.push({
      'title': 'numero de entradas efectuadas',
      'value': results.filter((result) => result.eqo == 'E1' ).length
    });


    //2 
    response.push({
      'title' : 'Numero de entidades atendidas',
      'value' : results.filter((result) => result.eqo == 'E2' ).length
    })

    //3
    var max = 0;
    results.forEach(function(result){
      if(result.ne >= max){
        max = result.ne
      }
    })
    if(max>0){
      max = max-1
    }
    response.push({
      'title' : 'Numero maximo de entidades en cola',
      'value' : max
    })

    //4
    var max = 0;
    results.forEach(function(result){
      if(result.ne >= max){
        max = result.ne
      }
    })
    response.push({
      'title' : 'Numero maximo de entidades en el ssstema',
      'value' : max
    })

    //5
    response.push({
      'title' : 'Tiempo promedio entre llegadas',
      'value' : (inPatter.reduce(function(a, b){return a + b}) / inPatter.length).toFixed(2)
    })


    //6
    response.push({
      'title' : 'Tiempo promedio entre servicios',
      'value' : (servicePatter.reduce(function(a, b){return a + b}) / servicePatter.length).toFixed(2)
    })
      
    return  response
  }


});