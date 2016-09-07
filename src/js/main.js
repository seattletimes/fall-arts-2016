// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");

// rebuild data from the DOM
var rows = $(".fall-arts tbody.events tr").map(function(tr) {
  var props = "event date location description".split(" ");
  var o = {};
  props.forEach(p => o[p] = tr.querySelector("." + p).innerHTML.trim().replace("&amp;", "&"));
  o.element = tr;
  o.category = tr.getAttribute("data-category");
  return o;
});

var catList = document.querySelector(".filters .categories");
var searchBox = document.querySelector(".filters .search");
var table = document.querySelector(".fall-arts")

var filterByCategory = function(cats, list) {
  return list.filter(r => cats.indexOf(r.category) > -1);
};

var filterBySearch = function(q, list) {
  var re = new RegExp(q, "i");
  return list.filter(r => r.event.match(re) || r.location.match(re) || r.description.match(re));
};

var applyFilters = function() {
  var checked = $("input[type=checkbox]:checked", catList).map(el => el.getAttribute("data-category"));
  var query = searchBox.value;
  var byCat = checked.length ? filterByCategory(checked, rows) : rows;
  var byQ = query ? filterBySearch(query, byCat) : byCat;
  rows.forEach(function(r) {
    if (byQ.indexOf(r) > -1) {
      r.element.classList.remove("hidden");
    } else {
      r.element.classList.add("hidden");
    }
  });
  if (!byQ.length) {
    table.classList.add("empty");
  } else {
    table.classList.remove("empty");
  }
};

catList.addEventListener("click", applyFilters);

searchBox.addEventListener("keyup", applyFilters);

applyFilters();