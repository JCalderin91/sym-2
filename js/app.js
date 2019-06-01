//Cuando el documento este cargafo ejecutar
$(document).ready(function () {
//Cuando se haga click en el boton para reiniciar

  function generateEventIn(pseudo) {
    return (-5 * Math.log(pseudo)).toFixed(2)
  }
  function generateEventService(pseudo) {
    return (-7.5 * Math.log(pseudo)).toFixed(2)
  }
  function sortArray(arr, dir){
    return arr.sort(function (a, b) {
      if(dir === 'asc'){
        return (parseFloat(a.t) - parseFloat(b.t))
      }else{
        if(dir === 'des'){
          return (parseFloat(b.t) - parseFloat(a.t))
        }
      }
    })
  }

  function sortArrayEvent(arr, dir){
    return arr.sort(function (a, b) {
      if(dir === 'asc'){
        return (parseFloat(a.cant) - parseFloat(b.cant))
      }else{
        if(dir === 'des'){
          return (parseFloat(b.cant) - parseFloat(a.cant))
        }
      }
    })
  }

  function deleteOne(arr, value){
    let auxArr = arr.slice()
    auxArr.forEach((item,key)=>{
      if(item.e == value){
        return auxArr.splice(key,1);
      }
    })
    return auxArr;
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
  var pseudo;
  var t;
  var lastEvent;

  $('#begin').on('click', function () {
    results = []

    var stop = {
      'condition': $('#stop-conditions').val(),
      'value': $('.stop_conditions').not('.d-none').find('input').val(),
    }
 
   //console.log(stop)

    if ($('#inicial-conditions')[0].checked) {
        init = {
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
       if(veryfyStop(results, stop)) results.push(init)
    }else{
      let aux = [];
      if(stop.condition == 'time'){
        aux = [{
          'e':'E3',
          't': parseFloat(stop.value)
        }]
      }
      init = {
        'tr': 0,
        'eqo': '-',
        'ne': 0,
        'ri': '-',
        'eg': '-',
        'le': aux
      }
      if(veryfyStop(results, stop)) results.push(init)
        
    }

      
    

    function veryfyStop(arr, conditions){
      switch(conditions.condition){
        case "request":
          var request = arr.filter((result) => result.eqo == 'E1' ).length
          if(request >= conditions.value) return false
        break;

        case "service":
        var services = arr.filter((result) => result.eqo == 'E2' ).length
          if(services >= conditions.value) return false
        break;

      }
      return true;
    }



    var limit = 1;
    
    do{
      //console.log(results)

      if(!$('#inicial-conditions')[0].checked && results.length <= 1){
        pseudo = Math.random().toFixed(3);
        t = generateEventIn(pseudo);
        inPatter.push({
          'cant': servicePatter.length,
          'pseudo' : pseudo,
          't' : t
        });

        init = {
          'tr': 0,
          'eqo': '-',
          'ne': 0,
          'ri': pseudo,
          'eg': [{
            'e': 'E1',
            't': t
          }],
          'le': sortArray(results[results.length-1].le.concat({
            'e': 'E1',
            't': t
          }) , 'asc')
        }

        if(veryfyStop(results, stop)) results.push(init)

        if(results[results.length-1].le[0].e != 'E3'){

          let newLe = deleteOne(results[results.length-1].le, 'E1')
          pseudo = Math.random().toFixed(3);
          t = generateEventIn(pseudo);
          inPatter.push({
            'cant': servicePatter.length,
            'pseudo' : pseudo,
            't' : t
          });

          init = {
            'tr': parseFloat(inPatter[inPatter.length-2].t).toFixed(2),
            'eqo': 'E1',
            'ne': parseInt( results[results.length-1].ne ) + 1,
            'ri': pseudo,
            'eg': [{
              'e': 'E1',
              't': (parseFloat(inPatter[inPatter.length-2].t) + parseFloat(t)).toFixed(2)
            }],
            'le': sortArray(newLe.concat({
              'e': 'E1',
              't': (parseFloat(inPatter[inPatter.length-2].t) + parseFloat(t)).toFixed(2)
            }) , 'asc')

          }
          if(veryfyStop(results, stop)) results.push(init)

          pseudo = Math.random().toFixed(3);
          t = generateEventService(pseudo);
          servicePatter.push({
            'cant': servicePatter.length,
            'pseudo' : pseudo,
            't' : t
          });
          
          newLe = deleteOne(results[results.length-1].le, 'E2')

          init = {
            'tr': results[results.length-1].tr,
            'eqo': '-',
            'ne': parseInt( results[results.length-1].ne ),
            'ri': pseudo,
            'eg': [{
              'e': 'E2',
              't': (parseFloat(results[results.length-1].tr) + parseFloat(t)).toFixed(2)
            }],
            'le': sortArray(newLe.concat({
              'e': 'E2',
              't': (parseFloat(results[results.length-1].tr) + parseFloat(t)).toFixed(2)
            }) , 'asc')
          }

          if(veryfyStop(results, stop)) results.push(init)
        }

      }

   




      lastEvent = results[results.length-1].le[0].e
      console.log('Ultimo evento: '+lastEvent)

      if(lastEvent == 'E2'){
        let newLe = deleteOne(results[results.length-1].le, 'E2')
        pseudo = Math.random().toFixed(3);
        t = generateEventService(pseudo);

        servicePatter.push({
          'cant': servicePatter.length,
          'pseudo' : pseudo,
          't' : t
        });

        if((parseInt(results[results.length-1].ne)-1) > 0){
          init = {
            'tr': results[results.length-1].le[0].t,
            'eqo': 'E2',
            'ne': parseInt( results[results.length-1].ne)  -1,
            'ri': pseudo,
            'eg': [{
              'e': 'E2',
              't': (parseFloat(results[results.length-1].le[0].t) + parseFloat(t)).toFixed(2)
            }],
            'le': sortArray(newLe.concat({
              'e': 'E2',
              't': (parseFloat(results[results.length-1].le[0].t) + parseFloat(t)).toFixed(2)
            }) , 'asc')
          }
        }else{
          init = {
            'tr': results[results.length-1].le[0].t,
            'eqo': 'E2',
            'ne': parseInt( results[results.length-1].ne)  -1,
            'ri': pseudo,
            'eg': '-',
            'le': sortArray(newLe, 'asc')
           }
        }

        if(veryfyStop(results, stop)) results.push(init)
      }

      if(lastEvent == 'E1'){
          pseudo = Math.random().toFixed(3);
          t = generateEventIn(pseudo);

          inPatter.push({
            'cant': inPatter.length,
            'pseudo' : pseudo,
            't' : t
          });

          let newTr = results[results.length-1].le[0].t

          let newLe = deleteOne(results[results.length-1].le, 'E1')
          init = {
            'tr': newTr,
            'eqo': 'E1',
            'ne': parseInt( results[results.length-1].ne ) + 1,
            'ri': pseudo,
            'eg': [{
              'e': 'E1',
              't': (parseFloat(newTr) + parseFloat(t)).toFixed(2)
            }],
            'le': sortArray(newLe.concat({
              'e': 'E1',
              't': (parseFloat(newTr) + parseFloat(t)).toFixed(2)
            }) , 'asc')

          }
          if(veryfyStop(results, stop)) results.push(init)
          let flag = init.le.filter((result) => result.e == 'E2' ).length

          if(flag == 0){
            newLe = deleteOne(results[results.length-1].le, 'E2')

            init = {
              'tr': results[results.length-1].tr,
              'eqo': '-',
              'ne': parseInt( results[results.length-1].ne ),
              'ri': pseudo,
              'eg': [{
                'e': 'E2',
                't': (parseFloat(results[results.length-1].tr) + parseFloat(t)).toFixed(2)
              }],
              'le': sortArray(newLe.concat({
                'e': 'E2',
                't': (parseFloat(results[results.length-1].tr) + parseFloat(t)).toFixed(2)
              }) , 'asc')
            }

            if(veryfyStop(results, stop)) results.push(init)
          }

           
        }


      



      limit++ //Por seguridad
      console.log(veryfyStop(results, stop))
      console.log(limit<32)
    }while(veryfyStop(results, stop) && limit < 32)
    




     
 

   var respuestas = verify__results(results, inPatter, servicePatter)
   let template, subTemplate, aux;
   template = '';

   respuestas.forEach(function(item) {
     template += `<li class="list-item-group">${item.title}: ${item.value}</li>`
   })

   $('#respuestas').html(template)

    template = '';
    aux = '';

    results.forEach(function (item, iteration) {
      subTemplate = ''
      item.le.forEach(function (el, key) {
        subTemplate += `<span>${el.e}/${el.t} seg</span>`;
        if (item.le.length != (key + 1)) {
          subTemplate += `, `;
        }
        //console.log(key);
      })

      if (item.eg != '-') {
        aux = `${item.eg[0].e}/${item.eg[0].t} seg`;
      } else {
        aux = '-'
      }

      template += `<tr>
        <td>${iteration+1}</td>
        <td>${item.tr} seg</td>
        <td>${item.eqo}</td>
        <td>${item.ne}</td>
        <td>${item.ri}</td>
        <td>${aux}</td>
        <td>${subTemplate}</td>
      </tr>`
      $('#resultsBody').html(template)

    })

    template = ''
    sortArrayEvent(inPatter, 'asc').forEach((item, key)=>{
      template += `<tr>
                <td>Exp${item.cant} = -5 m/c Ln ${item.pseudo} = ${item.t}</td>
              </tr>`;
    })

    $('#inPatter').html(template)

    template = ''
    sortArrayEvent(servicePatter, 'asc').forEach((item, key)=>{
      template += `<tr>
                <td>Exp${key+1} = -7.5 m/c Ln ${item.pseudo} = ${item.t}</td>
              </tr>`;
    })
    $('#servicePatter').html(template)

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
      'title' : 'Numero maximo de entidades en el sistema',
      'value' : max
    })

/*    //5
    response.push({
      'title' : 'Tiempo promedio entre llegadas',
      'value' : (inPatter.reduce(function(a, b){return a + b}) / inPatter.length).toFixed(2)
    })


    //6
    response.push({
      'title' : 'Tiempo promedio entre servicios',
      'value' : (servicePatter.reduce(function(a, b){return a + b}) / servicePatter.length).toFixed(2)
    })
      */
    return  response
  }


});