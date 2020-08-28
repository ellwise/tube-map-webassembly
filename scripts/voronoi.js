function create_voronoi(svg, nodes, mode) {

    const projection = get_projection(svg)

    const orient = {
        top: text => text.attr("text-anchor", "middle").attr("y", -20),
        right: text => text.attr("text-anchor", "start").attr("dy", "0.35em").attr("x", 20),
        bottom: text => text.attr("text-anchor", "middle").attr("dy", "0.71em").attr("y", 20),
        left: text => text.attr("text-anchor", "end").attr("dy", "0.35em").attr("x", -20)
    }

    const delaunay = d3.Delaunay.from(nodes.map(d => {
        return mode=="map" ? projection([d.lon, d.lat]) : [d.x, d.y]
    }));
    const hull = delaunay.hullPolygon()
    const left = Math.min(...hull.map(d => d[0]))
    const right = Math.max(...hull.map(d => d[0]))
    const upper = Math.min(...hull.map(d => d[1]))
    const lower = Math.max(...hull.map(d => d[1]))

    const voronoi = delaunay.voronoi([left-50, upper-150, right+50, lower+150]);
    const vor = svg.select(".foreground").append("g")
        .attr("class","voronoi")
    // build an array of groups to store the voronoi text
    nodes.forEach((d,j) => {
        const [x,y] = mode=="map" ? projection([d.lon, d.lat]) : [d.x, d.y]
        const poly = voronoi.cellPolygon(j)
        const [cx,cy] = d3.polygonCentroid(poly)
        const angle = (Math.round(Math.atan2(cy - y, cx - x) / Math.PI * 2) + 4) % 4;
        const cell = vor.append("g")
            .attr("class","voronoi_group")
        cell.append("text")
            .attr("class", "voronoi_backtext")
            .text(d.name.replace("Underground Station","").replace(" ","\n"))
            .call(angle===0 ? orient.right
                : angle===3 ? orient.top
                : angle===1 ? orient.bottom
                : orient.left)
            .attr("transform", "translate("+x+" "+y+")")
        cell.append("text")
            .attr("class", "voronoi_foretext")
            .text(d.name.replace("Underground Station","").replace(" ","\n"))
            .call(angle===0 ? orient.right
                : angle===3 ? orient.top
                : angle===1 ? orient.bottom
                : orient.left)
            .attr("transform", "translate("+x+" "+y+")")
        cell.append("circle")
            .attr("class", "voronoi_circle")
            .attr("stroke", d.edge_colour)
            .attr("fill", d.fill_colour)
            .attr("cx", x)
            .attr("cy", y)
        cell.append("path")
            .attr("class","voronoi_cell")
            .attr("d", voronoi.renderCell(j))
    })
}