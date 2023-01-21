
var data, store;

//	data read and store
d3.json("data/prn_data.json", function(err, g) {
	if (err) throw err;
	graph = g;
	data = $.extend(true, {}, g);
	update();
});

drag = simulation => {

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

function update() {
  let links = []
  let nodes = []

  var e = document.getElementById("filterInput");
  var text = e.options[e.selectedIndex].text;
  filterId = text;

  if(filterId === "All"){
     links = data.links.map(d => Object.create(d));
     nodes = data.nodes.map(d => Object.create(d));
  } else {
    links = data.links.filter(d => d.source == filterId || d.target == filterId).map(d => Object.create(d));
    const otherPersons = links.map(d => d.source !== filterId ? d.source : d.target)
    nodes = data.nodes.filter(d => d.id == filterId || otherPersons.indexOf(d.id) >= 0).map(d => Object.create(d));
  }
  console.log('filterId', filterId);
  console.log(nodes);
  console.log(links);

  //	svg selection and sizing
  const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 10;

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");

  // TIPS: https://www.d3indepth.com/force-layout/
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return d.radius * 5
      }));

      /*
      // use this to set greenminds branding
      const scale = d3.scaleOrdinal()
      .domain([1,2])
      .range(["lightseagreen", "coral"]);
			*/

      graphTypes = ["Project", "Organisation", "Place", "Species", "Person", "Service", "Activity"]
      graphDict = [
        {"Organisation": "#f0e100"}, //Titanium Yellow
        {"Place": "#d16666"}, //Fuzzy Wuzzy
        {"Species": "#4a4a4a"}, //Davy's Gray
        {"Person": "#94f1ee"}, //Electric Blue
        {"Project": "#004a98"}, //Yale Blue
        {"Service": "#A09BE7"}, //Maximum Blue Purple
        {"Activity": "#D6FF79"} //Mindaro
      ]

      //const data = [{A:1},{B:2},{C:3}]
      const gmcolor = graphDict.map(item => {
        const [name, y] = Object.entries(item)[0];
        return { y };
      });
      console.log('gmcolor', gmcolor);



      const gmscale = d3.scaleOrdinal()
      .domain(["Project", "Organisation", "Place", "Species", "Person", "Service", "Activity"])
      //.domain(graphDict.map(d => d.type)) // the name dimension (nominal))
			// bright colours
			.range(["#ff6700","#cc4bc2","#31afd4","#F9C846","#175676","#C3C3E6", "#7B3E19"]);
      // Safety Orange Blaze Orange, Fuschia Crayola, Cerulean Crayola, Maize Crayola, Blue Sapphire, Lavender Blue, Russet



      const scale = d3.scaleOrdinal(d3.schemeCategory10);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", d => d.weight)
      .attr("fill", d => gmscale(d.type))
      .call(drag(simulation));

  var label = svg.selectAll("g")
						.data(nodes)
						.enter()
						.append("text")
					    .text(function (d) { return d.caption; })
					    .style("text-anchor", "middle")
					    .style("fill", "#555")
					    .style("font-family", "Arial")
					    .style("font-size", 12);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
      .attr("x", function(d){ return d.x; })
    	.attr("y", function (d) {return d.y - 10; })
  });

  return svg.node();
}
