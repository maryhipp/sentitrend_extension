// Populating popup with data from background
var sentimentArray = [];
chrome.runtime.getBackgroundPage(function(backgroundPage) {
  console.log("popup.js is running")
  $('h2').text(backgroundPage.title)
  var html = '';
  sentimentArray = backgroundPage.sentimentArray
  // for (var i = 0; i < sentimentArray.length; i++) {
  //   html += '<li>' + sentimentArray[i].entity + ' : ' + (sentimentArray[i].score) + '</li>';
  // }
  // $('ul').html(html);

  // Send article to database when button is clicked
  // $('button').click( function() {
  //   //get the url
  //   var url = backgroundPage.url;
  //   //send the url to your server
  //   $.ajax({
  //     type: "POST",
  //     url: "localhost:3000/links",
  //     data: "url=" + url
  //  });
  // });

  // D3
  var dataset = sentimentArray;

  var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain(d3.extent(dataset, function(d) { return d.score; })).nice()
    .range([0, width]);

  var y = d3.scale.ordinal()
    .domain(dataset.map(function(d) { return d.entity; }))
    .rangeRoundBands([0, height], .2);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll(".bar")
    .data(dataset)
    .enter().append("rect")
    .attr("class", function(d) { return d.score < 0 ? "bar negative" : "bar positive"; })
    .attr("x", function(d) { return x(Math.min(0, d.score)); })
    .attr("y", function(d) { return y(d.entity); })
    .attr("width", function(d) { return Math.abs(x(d.score) - x(0)); })
    .attr("height", y.rangeBand());

  svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
        return d.entity;
   })
   .attr("x", function(d) { return x(Math.min(0, d.score)); })
   .attr("y", function(d) { return y(d.entity); })
   .attr("text-anchor", "start");

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .append("line")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y2", height);

});
