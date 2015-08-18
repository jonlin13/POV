// HI JON!
function dashboard(id, id2, fData){
    var barColor = 'steelblue';
    function segColor(c){ return {Army:"#DA1E14", Police:"#2A58CE", Cath_Civ:"#0CAF00",Prot_Civ:"#ED7A14",Cath_Para:"#00FF7D",Prot_Para:"#DDE800"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.freq.Army+d.freq.Police+d.freq.Cath_Civ+d.freq.Prot_Civ;});
    
    console.log(fData);

    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 600 - hGDim.l - hGDim.r, 
        hGDim.h = 200 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg").attr('class', 'bar-chart')
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")         
            .attr("transform", "translate(0," + hGDim.h + ")")            
            .call(d3.svg.axis().scale(x).orient("bottom"))
            .selectAll("text")
              .style("text-anchor", "end")
              .style("font-size","10px")            
              .style('fill', '#ffffff')
              .attr("transform","rotate(-55)");

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        // //Create the frequency labels above the rectangles.
        // bars.append("text").text(function(d){ return d3.format(",")(d[1])})
        //     .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
        //     .attr("y", function(d) { return y(d[1])-5; })
        //     .attr("text-anchor", "middle");
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ return s.State == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });            
        }        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:150, h: 150};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select(id2).append("svg").attr('class', 'pie-chart')
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));
            grayPoints(d.data.type);
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
            revertPoints();
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD)
            	.style("background-color","transparent");

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        }
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var tF = ['Prot_Civ','Cath_Civ','Police','Army','Cath_Para','Prot_Para'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    });    
    
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.State,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}

var freqData = [{'State': 1966,
  'freq': {'Army': 0,
           'Cath_Civ': 2,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 1,
           'Prot_Para': 0}},
 {'State': 1967,
  'freq': {'Army': 0,
           'Cath_Civ': 0,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 0,
           'Prot_Para': 0}},
 {'State': 1968,
  'freq': {'Army': 0,
           'Cath_Civ': 0,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 0,
           'Prot_Para': 0}},
 {'State': 1969,
  'freq': {'Army': 1,
           'Cath_Civ': 8,
           'Cath_Para': 2,
           'Police': 1,
           'Prot_Civ': 6,
           'Prot_Para': 1}},
 {'State': 1970,
  'freq': {'Army': 0,
           'Cath_Civ': 10,
           'Cath_Para': 7,
           'Police': 2,
           'Prot_Civ': 8,
           'Prot_Para': 0}},
 {'State': 1971,
  'freq': {'Army': 44,
           'Cath_Civ': 65,
           'Cath_Para': 23,
           'Police': 16,
           'Prot_Civ': 27,
           'Prot_Para': 3}},
 {'State': 1972,
  'freq': {'Army': 108,
           'Cath_Civ': 175,
           'Cath_Para': 75,
           'Police': 43,
           'Prot_Civ': 74,
           'Prot_Para': 11}},
 {'State': 1973,
  'freq': {'Army': 59,
           'Cath_Civ': 81,
           'Cath_Para': 36,
           'Police': 21,
           'Prot_Civ': 48,
           'Prot_Para': 13}},
 {'State': 1974,
  'freq': {'Army': 45,
           'Cath_Civ': 123,
           'Cath_Para': 24,
           'Police': 22,
           'Prot_Civ': 50,
           'Prot_Para': 7}},
 {'State': 1975,
  'freq': {'Army': 15,
           'Cath_Civ': 101,
           'Cath_Para': 31,
           'Police': 18,
           'Prot_Civ': 62,
           'Prot_Para': 28}},
 {'State': 1976,
  'freq': {'Army': 14,
           'Cath_Civ': 125,
           'Cath_Para': 17,
           'Police': 40,
           'Prot_Civ': 91,
           'Prot_Para': 12}},
 {'State': 1977,
  'freq': {'Army': 15,
           'Cath_Civ': 33,
           'Cath_Para': 8,
           'Police': 28,
           'Prot_Civ': 20,
           'Prot_Para': 7}},
 {'State': 1978,
  'freq': {'Army': 15,
           'Cath_Civ': 21,
           'Cath_Para': 7,
           'Police': 17,
           'Prot_Civ': 26,
           'Prot_Para': 1}},
 {'State': 1979,
  'freq': {'Army': 37,
           'Cath_Civ': 21,
           'Cath_Para': 9,
           'Police': 24,
           'Prot_Civ': 16,
           'Prot_Para': 2}},
 {'State': 1980,
  'freq': {'Army': 11,
           'Cath_Civ': 23,
           'Cath_Para': 5,
           'Police': 18,
           'Prot_Civ': 19,
           'Prot_Para': 2}},
 {'State': 1981,
  'freq': {'Army': 10,
           'Cath_Civ': 33,
           'Cath_Para': 17,
           'Police': 34,
           'Prot_Civ': 18,
           'Prot_Para': 3}},
 {'State': 1982,
  'freq': {'Army': 32,
           'Cath_Civ': 24,
           'Cath_Para': 7,
           'Police': 19,
           'Prot_Civ': 22,
           'Prot_Para': 5}},
 {'State': 1983,
  'freq': {'Army': 5,
           'Cath_Civ': 18,
           'Cath_Para': 8,
           'Police': 28,
           'Prot_Civ': 17,
           'Prot_Para': 2}},
 {'State': 1984,
  'freq': {'Army': 9,
           'Cath_Civ': 16,
           'Cath_Para': 12,
           'Police': 19,
           'Prot_Civ': 7,
           'Prot_Para': 1}},
 {'State': 1985,
  'freq': {'Army': 2,
           'Cath_Civ': 17,
           'Cath_Para': 5,
           'Police': 27,
           'Prot_Civ': 6,
           'Prot_Para': 0}},
 {'State': 1986,
  'freq': {'Army': 4,
           'Cath_Civ': 21,
           'Cath_Para': 6,
           'Police': 20,
           'Prot_Civ': 13,
           'Prot_Para': 2}},
 {'State': 1987,
  'freq': {'Army': 3,
           'Cath_Civ': 16,
           'Cath_Para': 26,
           'Police': 24,
           'Prot_Civ': 27,
           'Prot_Para': 7}},
 {'State': 1988,
  'freq': {'Army': 23,
           'Cath_Civ': 27,
           'Cath_Para': 15,
           'Police': 18,
           'Prot_Civ': 13,
           'Prot_Para': 5}},
 {'State': 1989,
  'freq': {'Army': 24,
           'Cath_Civ': 22,
           'Cath_Para': 3,
           'Police': 11,
           'Prot_Civ': 14,
           'Prot_Para': 3}},
 {'State': 1990,
  'freq': {'Army': 9,
           'Cath_Civ': 26,
           'Cath_Para': 6,
           'Police': 20,
           'Prot_Civ': 17,
           'Prot_Para': 2}},
 {'State': 1991,
  'freq': {'Army': 5,
           'Cath_Civ': 41,
           'Cath_Para': 14,
           'Police': 14,
           'Prot_Civ': 18,
           'Prot_Para': 8}},
 {'State': 1992,
  'freq': {'Army': 4,
           'Cath_Civ': 42,
           'Cath_Para': 14,
           'Police': 7,
           'Prot_Civ': 17,
           'Prot_Para': 2}},
 {'State': 1993,
  'freq': {'Army': 6,
           'Cath_Civ': 45,
           'Cath_Para': 4,
           'Police': 8,
           'Prot_Civ': 21,
           'Prot_Para': 2}},
 {'State': 1994,
  'freq': {'Army': 1,
           'Cath_Civ': 40,
           'Cath_Para': 3,
           'Police': 5,
           'Prot_Civ': 12,
           'Prot_Para': 8}},
 {'State': 1995,
  'freq': {'Army': 0,
           'Cath_Civ': 7,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 1,
           'Prot_Para': 1}},
 {'State': 1996,
  'freq': {'Army': 1,
           'Cath_Civ': 7,
           'Cath_Para': 7,
           'Police': 0,
           'Prot_Civ': 1,
           'Prot_Para': 3}},
 {'State': 1997,
  'freq': {'Army': 1,
           'Cath_Civ': 9,
           'Cath_Para': 1,
           'Police': 4,
           'Prot_Civ': 5,
           'Prot_Para': 2}},
 {'State': 1998,
  'freq': {'Army': 0,
           'Cath_Civ': 32,
           'Cath_Para': 1,
           'Police': 1,
           'Prot_Civ': 19,
           'Prot_Para': 3}},
 {'State': 1999,
  'freq': {'Army': 0,
           'Cath_Civ': 0,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 5,
           'Prot_Para': 1}},
 {'State': 2000,
  'freq': {'Army': 0,
           'Cath_Civ': 0,
           'Cath_Para': 1,
           'Police': 0,
           'Prot_Civ': 3,
           'Prot_Para': 8}},
 {'State': 2001,
  'freq': {'Army': 0,
           'Cath_Civ': 9,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 7,
           'Prot_Para': 4}},
 {'State': 2002,
  'freq': {'Army': 0,
           'Cath_Civ': 3,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 6,
           'Prot_Para': 2}},
 {'State': 2003,
  'freq': {'Army': 0,
           'Cath_Civ': 3,
           'Cath_Para': 1,
           'Police': 0,
           'Prot_Civ': 1,
           'Prot_Para': 5}},
 {'State': 2004,
  'freq': {'Army': 0,
           'Cath_Civ': 1,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 2,
           'Prot_Para': 1}},
 {'State': 2005,
  'freq': {'Army': 0,
           'Cath_Civ': 2,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 6,
           'Prot_Para': 0}},
 {'State': 2006,
  'freq': {'Army': 0,
           'Cath_Civ': 2,
           'Cath_Para': 0,
           'Police': 0,
           'Prot_Civ': 1,
           'Prot_Para': 0}}];

dashboard('#bargraph','#piechart',freqData);
function segColor2(c){ return {Army:"#DA1E14", Police:"#2A58CE", Catholic:"#0CAF00",Protestant:"#ED7A14",Cath_Para:"#00FF7D",Prot_Para:"#DDE800"}[c]; }



// function doAll () {
// Create the Google Map…
var CustomMapType = new google.maps.StyledMapType([
{
  stylers: [
  {hue: '#B2B3B3'},
  {gamma: 0.5},
  {weight: 0.5}
  ]
},
{
  elementType: 'labels',
  stylers: [{visibility: 'off'}]
},
{
    featureType: "administrative.country",
    elementType: "labels",
    stylers: [
        { visibility: "on" }
    ]
},
{
  featureType: 'water',
  stylers: [{color: '#D4F6FF'}]
},
{
  featureType: 'road',
  elementType: 'geometry',
  stylers: [
  {color: '#6B696A'
  ,weight: 1.0 }
  ]
}
  ], {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { hue: '#5D9950' },
      { gamma: 1.4 },
      { saturation: 82 },
      { lightness: 56 }
    ]
  },
  {
    name: 'Custom Style'
  });

var CustomMapTypeId = 'custom_style';

var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 13,
  center: new google.maps.LatLng(54.596869, -5.930409),
  mapTypeControlOptions:{
    mapTypeIds: [google.maps.MapTypeId.ROADMAP,CustomMapTypeId]    
  },disableDefaultUI: true
});

map.mapTypes.set(CustomMapTypeId,CustomMapType);
map.setMapTypeId(CustomMapTypeId);


var tooltip = d3.select("body").append("div").attr("class","tooltip")
.attr("width",100);

// Load the station data. When the data comes back, create an overlay.
d3.json("trimmed_georef.json", function(data) {
  var overlay = new google.maps.OverlayView();

console.log(data);

var points = data.features;

var color = d3.scale.quantize()
    .domain([328,1305])
    .range(d3.range(8).map(function(i) { return "q" + i + "-8"; }));

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
        .attr("class", "stations");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;

      var marker = layer.selectAll("svg")
          .data(d3.entries(points))
          .each(transform) // update existing markers
        .enter().append("svg:svg")
          .each(transform)
          .attr("class", "marker");

      // Add a circle.
      marker.append("svg:circle")
          .attr("r", 6)
          .attr("cx", padding)
          .attr("cy", padding)
          .attr("fill",function(d){ return segColor2(d.value.properties["Victim Sect"]); })
          .attr("id",function(d) {
            // console.log("p" + d.value.properties["Victim Sect"]);
            // if (d.value.properties["Victim Sect"] == "Protestant"){
            //   out = "pProt_Civ";              
            // }
            // else if (d.value.properties["Victim Sect"] == "Catholic"){
            //   out = "pCath_Civ";              
            // }
            // else {out = d.value.properties["Victim Sect"]}
            console.log("Victim sect for circle:"+d.value.properties["Victim Sect"]);
            return d.value.properties["Victim Sect"];})
          // .attr("class", function(d) { return (typeof color(d.value.properties["Num Searches"]) == "string" ? color(d.value.properties["Num Searches"]) : ""); })
          .on("mouseover",showTooltip)
          .on("mousemove",moveTooltip)
          .on("mouseout",hideTooltip);

      // Add a label.
      marker.append("svg:text")
          .attr("x", padding + 7)
          .attr("y", padding)
          .attr("dy", ".31em");
          // .text(function(d) { return d.value.properties.Name; });

      function transform(d) {
        d = new google.maps.LatLng(d.value.geometry.coordinates[0],
          d.value.geometry.coordinates[1]);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };

  // Bind our overlay to the map…
  overlay.setMap(map);
});

d3.csv("thumbnails.csv", function(d) {
  console.log(d);
  });

//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
  moveTooltip();
console.log('here');
  tooltip.style("display","block")
      .html(d.value.properties["Name"]+"<br/>"+
        "Age: "+d.value.properties["Age"]+"<br/>");
  
  highlightThumb(Math.floor(Math.random() * 60));
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
  unhighlight();
}

function highlightThumb (d) {
  console.log("highlightThumb");
  console.log(d);
  d3.select("#thumbs").select("#ScSh" + d)
    .attr("class","selected")
    .attr("position","absolute")
    // .style( {width: '160px',
    //         height: '75px'} )
    // .attr("z-index",50);
}

function unhighlight () {
  console.log("unhighlight");
  d3.select("#thumbs").selectAll("img")
    .style( {width: '80px',
            height: '50px'} )
    .attr("class","desaturate")
    .attr("position","relative");
}

function grayPoints(p) {
  console.log("grayPoints: "+p);
  pointTypes = {Army:"#DA1E14", Police:"#2A58CE", Catholic:"#0CAF00",Protestant:"#ED7A14",Cath_Para:"#00FF7D",Prot_Para:"#DDE800"};
  if (p == "Prot_Civ") {p="Protestant";}
  else if (p == "Cath_Civ") {p="Catholic";}
  for (i in pointTypes) {
    if (i !=p) {
      d3.selectAll("#"+i)
        .style("fill","transparent");
        // .style("z-index",-50);
    }
  }
}

function revertPoints() {
  console.log("revertPoints");
  pointTypes = {Army:"#DA1E14", Police:"#2A58CE", Catholic:"#0CAF00",Protestant:"#ED7A14",Cath_Para:"#00FF7D",Prot_Para:"#DDE800"};
  for (i in pointTypes) {
    d3.selectAll("#"+i)
      .style("fill",function(d,i){ return segColor2(d.value.properties["Victim Sect"]); });
      // .attr("stroke",)
    }
}

d3.json("thumbnails.json", function(thumbs) {
  // names.push(d);
  console.log(thumbs);

  var pics = d3.select("#thumbs").selectAll("t")
    .data(thumbs.names);

var vic_types = ["Cath_Civ","Prot_Civ","Army","Police"];

  pics.enter()
    .append("img")
    .attr('image-rendering','optimizeQuality')
    .attr("xlink:href", function(d){ console.log(d);return "/" + d; } )
    .attr("src", function(d){ return "/" + d; } )
        .style(
          {width: '80px',
            height: '50px'}
            )
    .attr("class","desaturate")
    .attr("id",function(d) { return d.split(".")[0].split("/")[2]; });
    // .attr("id",function(d) { return vic_types[Math.floor(Math.random()*3)]; })
  });

  