chart = {
  data = FileAttachment("prn_data@13.json").json();
  let height = 400;
  let width = 700;
  let d3 = require("d3@5")
  var rad = {
    return d => d.weight;
  }
  var color = {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.type);
  }
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

  let links = []
  let nodes = []
  
  if(filterId === "All"){
     links = data.links.map(d => Object.create(d));
     nodes = data.nodes.map(d => Object.create(d));
  } else {
    links = data.links.filter(d => d.source == filterId || d.target == filterId).map(d => Object.create(d));
    const otherPersons = links.map(d => d.source !== filterId ? d.source : d.target)
    nodes = data.nodes.filter(d => d.id == filterId || otherPersons.indexOf(d.id) >= 0).map(d => Object.create(d));
  }
  // TIPS: https://www.d3indepth.com/force-layout/
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) {
        return d.radius * 5
      }));

  const svg = d3.select(DOM.svg(width, height))
    .style('max-width', '100%')
    .style('max-height', '100%');

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
      .attr("fill", color)
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

  invalidation.then(() => simulation.stop());

  return svg.node();
}
