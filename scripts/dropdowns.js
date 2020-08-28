function fill_dropdowns(json_whole_network, dropdown_name) {
    // add options to dropdowns
    const compareNodes = function(a,b) {
       const nameA = a.name.toUpperCase(); // ignore upper and lowercase
       const nameB = b.name.toUpperCase(); // ignore upper and lowercase
       if (nameA < nameB) {
          return -1;
       }
       if (nameA > nameB) {
          return 1;
       }
       return 0;
    }
    const nodes = json_whole_network.nodes
    nodes.sort(compareNodes) 
    const dropdown_list = document.getElementById(dropdown_name)
    nodes.forEach((node,index) => {
       if (node.id.includes("EntEx")) {
          const option = document.createElement("option");
          option.innerHTML = node.name;
          option.value = node.id;
          dropdown_list.options.add(option)
       }
    })
    return dropdown_list
}