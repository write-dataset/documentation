

// INDEX get static content 

$(function(){
    $("#intro").load("public/intro.html"); 
  });
  $(function(){
    $("#documentationContent").load("public/documentation.html"); 
  });
  $(function(){
    $("#csContent").load("public/casestudies.html"); 
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


// ENDPOINT PAGE BUILDER

fetch("http://10.200.4.145:9999/blazegraph/sparql", { mode: "no-cors" });
const yasgui = new Yasgui(document.getElementById("yasgui"), {
      corsProxy: "",
      requestConfig: { endpoint: "http://10.200.4.145:9999/blazegraph/sparql"},  
      copyEndpointOnNewTab: false,
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


// creates the content off the page
fetchJSONFile('public/data/query-list.json', function(data) {
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
    console.log("<div id='yasr" + i + s + "></div>")
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

function run_query(queryStr, i, s) {


  var str = "yasr" + i + s
  var old_table = document.getElementById(str)
  if (old_table) { old_table.innerHTML = ""; } // replaces with new loaded content
  
  
  const yasr = new Yasr(document.getElementById(str));
var html_decoded = queryStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#47;/g, '/').replace(/&quot;/g, '\"');
var encoded = encodeURIComponent(html_decoded)

$.ajax({
  type: 'GET',
  url: 'http://10.200.4.145:9999/blazegraph/' +'sparql?query=' + encoded + '&format=json',
  success: function(returnedJson) {
    yasr.setResponse({
      data: returnedJson,
      contentType: "application/sparql-results+json",
      status: 200,
      executionTime: 1000, // ms
      // error to show
    })
    yasr.draw()
    yasr.somethingDrawn()
    yasr.selectPlugin("table")
    


  //console.log(returnedJson);

  /*var table = document.createElement("table");
  var tr1 = document.createElement("tr");

  $("#searchresult").append(table)
  table.appendChild(tr1)
  
  for (var th in returnedJson.head.vars) {
    $(tr1).append("<th>" + returnedJson.head.vars[th] + '</th>')
  }

  for (i = 0; i < returnedJson.results.bindings.length; i++) {
    var myUrl = returnedJson.results.bindings[i];
    var tr2 = document.createElement("tr");
    table.append(tr2)
    console.log(myUrl)
    for (var el in myUrl) {
      if (myUrl[el].value !== undefined) {
        if (myUrl[el].type == 'uri') {
          $(tr2).append("<td><a style=\"pointer-events:none\" href=\">" + myUrl[el].value + '\">' + myUrl[el].value + '</a></td>')} 
        else {$(tr2).append("<td>" + myUrl[el].value + '</td>')}
      }
      else {$(tr2).append("<td>" + "" + '</td>')}
    }

              };   
  table.style.width = '100%';
  table.style.textAlign = 'left';
  var win = window.open("")
  win.document.body.append(table) */
} 
              });    }



