function identify(query_string){
  console.log("query: ")
  console.log(query_string);
  if(query_string = ''){
    var query = JSON.parse(query_string);
  } else {
    query = {};
  }

  // limpar tudo
  $("#especiesElegiveis").empty();
  $(".descritor").empty();
  $("#especiesDescartadas").empty();

  $.post("/api/Identification/identify", {param: query}, function(data){

    var ids = data.response.eligibleItems.map(function(item) {return item.id});
    var species_query = {where: {id: {inq: ids}}}

    $.getJSON("/api/Species/", {filter : species_query}, function(especies){

      /* especies */
      especies.forEach(function(especie){
        escreverEspecie(especie, "#especiesElegiveis");
      });

      /* descritores */
      //TODO: Agregador de descritores
      data.response.eligibleStates.forEach(function(descritor){
        escreverDescritor(descritor);
      });

      createAccordion();
      escreverEspeciesDescartadas(ids, query);
    });
  });
}

function escreverEspeciesDescartadas(ids, query){
  $.post("/api/Identification/identify", {}, function(data){

    //var excluding_ids = data.response.eligibleItems.map(function(item) { if(ids.indexOf(item.id) == -1){ return item.id}});
    var excluding_ids = $.map( data.response.eligibleItems, function(item) { if(ids.indexOf(item.id) == -1){ return item.id}});
    var excluding_species_query = {where: {id: {inq: excluding_ids}}}

    if(excluding_ids.length > 0){
      $.getJSON("/api/Species/", {filter : excluding_species_query}, function(especies){

        /* especies descartadas */
        especies.forEach(function(especie){
          escreverEspecie(especie, "#especiesDescartadas");
        });

        /* descritores descartados */
        query.forEach(function(estado){
          $("#descritoresSelecionados").append("<h3>" + estado.descriptor + ": " + estado.state + "</h3>");
        });
      });
    }
  });
};

function escreverEspecie(especie, nicho){
  $(nicho).append("<div class='especies' id = " + especie.id + "></div>");
  $(nicho + " > #" + especie.id).append("<img src='img/lspm.jpg'>");
  $(nicho + " > #" + especie.id).append("<div class='nsp'></div>");

  $.getJSON("/api/Specimens/" + especie.specimens[0].id, {}, function(especime){
    var nome = especime['dwc:scientificName'].value;
    var autor = especime['dwc:scientificNameAuthorship'].value;
    var familia = especime['dwc:family'].value;

    $(nicho + " > #" + especie.id + " > .nsp").append("<a href='/profile/species/" + especie.id + "'><p class='nomesp'><i>" + nome + " </i>" + autor + "</p></a>");
    $(nicho + " > #" + especie.id + " > .nsp").append("<p class='famisp'>" + familia + "</p>");
  });
}

function escreverDescritor(descritor){
  //TODO: usar ids para consultar Schema
  $(".descritor").append("<h3>" + descritor.descriptor_name + "</h3>");
  $(".descritor").append("<ul class='valoresi'></ul>");

  descritor.states.forEach(function(estado){
    $(".descritor ul").last().append("<li class='vimagens'><p><!-- Imagem representante do valor fixo --><img src='/img/lspm.jpg' class='vimg'><!-- Link e icone para o glossário --><a href='#' target='_blank'><img src='/img/glo.png' class='vglos'></a>" + estado.state + " - " + estado.count + "</p></li>");
  });
}
