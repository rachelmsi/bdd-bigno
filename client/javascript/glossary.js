function writeSchema(schema, referenceLabel){  
  lang = localStorage.language?localStorage.language:"pt-BR";
  var id= schema.id;
  if (id.split(":")[2] == "State" || id.split(":")[2] == "CategoricalDescriptor" || id.split(":")[2] == "NumericalDescriptor" || id.split(":")[2] == "Category"){
    var html = $('<div class="glossario-s" id="'+id.split(":").join("-")+'"><a target="_blank"><img id="image"></img></a> <h2></h2><h3></h3><p id="description"></p></div>');    
    $("#content").append(html);    
    $("#" + id.split(":").join("-") +" > a > #image ").hide();
    readGlossary(id);
  }
}

function readGlossary(id){
  $.getJSON("/api/Schemas/"+id, function(data){
    var name = "Não disponível";
    if(data["class"]=="CategoricalDescriptor" || data["class"]=="NumericalDescriptor"){
      name = data.field;
    } else if(data["class"]=="Category"){
      name = data.category;
    } else if(data["class"]=="State"){
      name = data.state;
    }
    var description = "Não disponível";
    if(data.definition)
      description = data.definition;

    $("#" + id.split(":").join("-")).find("h2").html(name);

    if ((data["class"] == "CategoricalDescriptor" || data["class"] == "NumericalDescriptor") && data.state)
      $("#" + id.split(":").join("-")).find("h3").html(data.category);
    else if (data["class"] == "State")
      $("#" + id.split(":").join("-")).find("h3").html(data.category + ": " + data.field);
    $("#" + id.split(":").join("-") + " > #description").html(description);

    if (data.images && data.images.length > 0){      
      $("#" + id.split(":").join("-") + " > a").find('#image').attr("src", data.images[0].resized);
      $("#" + id.split(":").join("-") + " > a").attr("href", data.images[0].original);
      $("#" + id.split(":").join("-") +" > a").find('#image').show();
    }
    if(data.references && data.references.length>0){
      var refLabel = $('<div class="ref-glossario" id="references">'+referenceLabel+'/div>');      
      $("#" + id.split(":").join("-")).append(referenceLabel).append(":");;
      data.references.forEach(function(ref) {        
        $("#" + id.split(":").join("-")).append("<p>"+ref+"</p>");        
      });      
    }
  });
}

function busca(nothing){
  var key = $("#buscaglossario").val().trim().toLowerCase();
  if (nothing) key = "";
  $("article div").each(function(){
    if ($(this).find("h2").text().toLowerCase().indexOf(key) === -1){
      $(this).fadeOut();
    } else {
      $(this).fadeIn();
    }
  });
}
