

// INDEX get static content 

$(function(){
    $("#intro").load("static/intro.html"); 
  });
  $(function(){
    $("#documentationContent").load("static/documentation.html"); 
  });
  $(function(){
    $("#csContent").load("static/casestudies.html"); 
  });
$(function(){
    $("#csData").load("static/rdfdata.html"); 
  });
  $(function(){
    $("#team").load("static/team.html"); 
  });

// INDEX build navbar

$(window).load(function() {
  $('#loading').hide();
}); 

var $content = $('.menu-content');

function showContent(type) {
$content.hide().filter('.' + type).show();
}

$('.nav').on('click', '.menu-btn', function(e) {
showContent(e.currentTarget.hash.slice(1));
e.preventDefault();
}); 

// show 'about' content only on page load (if you want)
showContent('home');

var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  var active = container.classList.toggle("active-cont");
});

// ZOOM IN ZOOM OUT

var zoom = 1;
		
$('.zoom').on('click', function(){
  zoom += 0.1;
  $('.target').css('transform', 'scale(' + zoom + ')');
});
$('.zoom-init').on('click', function(){
  zoom = 1;
  $('.target').css('transform', 'scale(' + zoom + ')');
});
$('.zoom-out').on('click', function(){
  zoom -= 0.1;
  $('.target').css('transform', 'scale(' + zoom + ')');
});

// QUERY PAGE BUILDER

// gets JSON file where all queries are stored               
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
              var data = JSON.parse(httpRequest.responseText);
              if (callback) callback(data);
          }
      }
  };
  httpRequest.open('GET', path);
  httpRequest.send(); 
}


// CQs PAGE BUILDER 

fetchJSONFile('static/data/query-list.json', function(data) {
for (var i = 0; i < data.length; i++){
  var obj = data[i];
  var title = document.createElement("h3");
  var card_body = document.createElement("div");
  card_body.classList.add('query-card-body')
  card_body.classList.add('p-2')

  title.append(obj.section_title);
  $('#card_box').append(title)
  $('#card_box').append(card_body)

  for (var s = 0; s < obj.values.length; s++){ 
    var p = document.createElement("p");
    var code = document.createElement("pre");
    
    var query_string =  obj.values[s].SPARQL_query.replace(/\r\n/g, '').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    p.append(obj.values[s].NL_query);
    var button = "\<button type= \"button\" class=\"btn btn-link float-end\" onclick=\"run_query(\'" + query_string + "\', " + i + ", " + s +")\"\>\<i class=\"fas fa-play\"\>\</i\>\</button\>"
    
    code.append(obj.values[s].SPARQL_query)
    $(card_body).append(p).append(button)
    if (obj.values[s].info) {
      var info_button = "<button type=\"button\" class=\"btn btn-link float-end\" data-bs-toggle=\"collapse\" data-bs-target=\"#info" + i + s + "\" aria-expanded=\"true\" aria-controls=\"info" + i + s + "\"><i class=\"fas fa-info-circle\"\>\</i\></button><div id=\"info" + i + s + "\" class=\"accordion-collapse collapse\" aria-labelledby=\"headingOne\" data-bs-parent=\"#accordionExample\"><div class=\"accordion-body\">" + obj.values[s].info + "</div></div>"
      $(card_body).append(info_button);    
    };
    $(card_body).append(code)
    $(card_body).append("<div id='yasr" + i + s + "'></div>")
    $(card_body).append("<hr class=\"bg-danger border-2 border-top border-danger\">")
    
    
  }}});


