function get_projection(svg) {
    const width = svg.node().viewBox.baseVal.width
    const height = svg.node().viewBox.baseVal.height
    const projection = d3.geoMercator()
       .center([-0.1, 51.5])
       .scale(0.8*3*Math.pow(2, 17) / (2 * Math.PI))
       .translate([width / 2, height / 2]);
    return projection
 }
 
 async function draw_background(svg, projection) {
 
    const path = d3.geoPath(projection)
    const background = svg.append("g")
      .attr("class","background")
 
    // draw london
    const london = await d3.json("./data_raw/londonBoroughs.json");
    background.append("g")
      .attr("class","borough_shapes")
       .append("path")
       .datum(topojson.merge(london, london.objects.boroughs.geometries))
       .attr("d", path)
    background.append("g")
      .attr("class","borough_boundaries")
       .append("path")
       .datum(topojson.mesh(london, london.objects.boroughs, (a, b) => a !== b))
       .attr("d", path)
 
    // add geo-accurate tube lines
    const tube = await d3.json("./data_raw/londonTubeLines.json");
    const id_to_colour = id => {
       switch (id) {
          case "Bakerloo": return "#B36305";
          case "Central": return "#E32017"
          case "Circle": return "#FFD300"
          case "District": return "#00782A"
          case "Hammersmith & City": return "#F3A9BB"
          case "Jubilee": return "#A0A5A9"
          case "Metropolitan": return "#9B0056"
          case "Northern": return "#000000"
          case "Piccadilly": return "#003688"
          case "Victoria": return "#0098D4";
          case "Waterloo & City": return "#95CDBA"
          case "DLR": return "#00A4A7"
          default: console.log(id)
       }
    }
    background.append("g")
      .attr("class","tube_lines")
       .selectAll("path")
       .data(topojson.feature(tube, tube.objects.line).features)
       .join(enter =>
          enter.append("path")
          .attr("stroke", d => id_to_colour(d.id))
          .attr("d", path)
       )
 
    return background
 }