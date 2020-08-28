function run_simulation(svg, data) {

   const length_scale = 16

   const links = data.links.map(d => Object.create(d));
   const nodes = data.nodes.map(d => Object.create(d));

   const width = svg.node().viewBox.baseVal.width
   const height = svg.node().viewBox.baseVal.height

   const simulation = d3.forceSimulation(nodes)
      .force("link", 
         d3.forceLink(links)
            .id(d => d.id)
            .distance(d => length_scale*d.weight)
            .strength(1)
            .iterations(50))
      .force("charge",
         d3.forceManyBody()
            .strength(-400))
      .force("center",
         d3.forceCenter(width / 2, height / 2)) 
      //.force("align",
      //   forceAlign(width/2, height/2, origin, destination))
      //.force("bound",
      //   forceBound(width/2, height/2, 0.8*width, 0.8*height))
      .force("oval",
         d3.forceY(height/2)
            .strength(0.2))
      //.alpha(1)
      .alphaDecay(0.02)

   const projection = get_projection(svg)
      nodes.forEach(d => {
          const pos = projection([d.lon, d.lat])
          d.map_x = pos[0]
          d.map_y = pos[1]
      })

   return {simulation, links, nodes}

}

function forceBound(x0, y0, width, height) {
   var nodes;
 
   function force() {
      var n = nodes.length,
         a = width/2,
         b = height/2;

      nodes.forEach(node => {
         x = (node.x-x0), y = (node.y-y0);
         if (Math.pow(x/a,2) + Math.pow(y/b,2) > 1) {
            theta = Math.atan2(y, x)
            k = 1/Math.sqrt(Math.pow(b*Math.cos(theta),2) + Math.pow(a*Math.sin(theta),2))
            node.x = k*a*b*Math.cos(theta) + x0;
            node.y = k*a*b*Math.sin(theta) + y0;
         }
      })
   }
 
   force.initialize = function(_) {
     nodes = _;
   };
   
   force.x = function(_) {
     return arguments.length ? (x0 = +_, force) : x0;
   };
 
   force.y = function(_) {
     return arguments.length ? (y0 = +_, force) : y0;
   };
 
   return force;
}

// ADD IN SOME STOCHASTICITY! JUST SHAKE SOME OF THE NODES, AND DECAY
// MAYBE ONLY DO IT IF THERE ARE SEGMENT INTERSECTIONS?

function forceAlign(x0, y0, origin, destination) {
   var nodes;
 
   function force() {
     var n = nodes.length,
         node,
         angle,
         tmp;
     
     // rotate to align origin/destination with horizontal
     tmp = nodes.filter(d => d.id==origin | d.id==destination)
     angle = Math.atan2(tmp[1].y-tmp[0].y, tmp[1].x-tmp[0].x)
     nodes.forEach(node => {
       x = (node.x-x0), y = (node.y-y0);
       node.x = x*Math.cos(-angle) - y*Math.sin(-angle) + x0;
       node.y = x*Math.sin(-angle) + y*Math.cos(-angle) + y0;
     })
     
   }
 
   force.initialize = function(_) {
     nodes = _;
   };
   
   force.x = function(_) {
     return arguments.length ? (x0 = +_, force) : x0;
   };
 
   force.y = function(_) {
     return arguments.length ? (y0 = +_, force) : y0;
   };
 
   return force;
}