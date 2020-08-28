function draw_foreground(svg, links, nodes) {

    const train_links = links.filter(d=>d.line_id!="pedestrian");
    const foot_links = links.filter(d=>d.line_id=="pedestrian");
  
    // all_borders, train fill, node_edge, walk_fill, node fill
    const foreground = svg.append("g")
        .attr("class","foreground")
        .style("opacity",0)


    const metro = foreground.append("g")
        .attr("class","metro")
    metro.append("g").selectAll("all_borders")
       .data(links)
       .join(enter =>
          enter.append("line")
             .attr("class","all_borders")
             .attr("stroke", d => d.edge_colour)
       );
    metro.append("g").selectAll("train_fill")
       .data(train_links)
       .join(enter =>
          enter.append("line")
             .attr("class","train_fill")
             .attr("stroke", d => d.fill_colour)
       );
    metro.append("g").selectAll("node_edge")
       .data(nodes)
       .join(enter =>
          enter.append("circle")
             .attr("class","node_edge")
             .attr("stroke", d => d.edge_colour)
       );
    
    metro.append("g").selectAll("foot_link_fill")
       .data(foot_links)
       .join(enter =>
          enter.append("line")
             .attr("class","foot_link_fill")
             .attr("stroke", d => d.fill_colour)
       );
    metro.append("g").selectAll("node_fill")
       .data(nodes)
       .join(enter =>
          enter.append("circle")
             .attr("class","node_fill")
             .attr("fill", d => d.fill_colour)
       );
          
    return foreground
 
 }
 
 function set_metro_sizes() {

    const transform = d3.event.transform
    const scale = transform.k

    const border = 0.075*24 / scale
    const line_width = 0.3*24 / scale
    const length_scale = 16 / scale
    const font_size = 16 / scale
    const min_radius = (line_width+border)/2
 
    window.foreground.attr("transform", transform);
    window.foreground.select(".metro").selectAll(".all_borders")
       .attr("stroke-width", line_width)
    window.foreground.select(".metro").selectAll(".train_fill")
       .attr("stroke-width", line_width-2*border)
    window.foreground.select(".metro").selectAll(".node_edge")
       .attr("stroke-width", border)
       .attr("r", min_radius)
    window.foreground.select(".metro").selectAll(".foot_link_fill")
       .attr("stroke-width", line_width-2*border)
    window.foreground.select(".metro").selectAll(".node_fill")
       .attr("r", min_radius-border/2)
    window.foreground.select(".metro").selectAll(".text_names")
       .attr("font-size", font_size + "px")

    window.foreground.select(".voronoi").selectAll(".voronoi_backtext")
       .attr("font-size", (font_size+1) + "px")
    window.foreground.select(".voronoi").selectAll(".voronoi_foretext")
       .attr("font-size", font_size + "px")
    window.foreground.select(".voronoi").selectAll(".voronoi_circle")
       .attr("stroke-width", border)
       .attr("r", min_radius*1.5)
 }
 
 function reposition_map(svg, foreground) {
 
    const zoom = d3.zoom().on("zoom", set_metro_sizes);
    foreground.call(zoom.transform, d3.zoomIdentity)
    
    foreground
        .select(".metro")
       .selectAll("circle")
       .attr("cx", d => d.map_x)
       .attr("cy", d => d.map_y);
    
    foreground
        .select(".metro")
       .selectAll("line")
       .attr("x1", d => d.source.map_x)
       .attr("y1", d => d.source.map_y)
       .attr("x2", d => d.target.map_x)
       .attr("y2", d => d.target.map_y);

 }
 
 function reposition_sim(svg, foreground) {
 
    foreground
    .select(".metro")
    .selectAll("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
 
    foreground
    .select(".metro")
    .selectAll("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);
 
    const zoom = d3.zoom().on("zoom", set_metro_sizes);
    const zoom_transform = zoomFit2(svg, foreground)
    foreground.call(zoom.transform, zoom_transform)
 }