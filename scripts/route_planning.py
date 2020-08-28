import networkx as nx
#from js import json_whole_network, source_val, target_val
import json

def style_graph(G):

    mapping = {"bakerloo":"#B36305",
                "central":"#E32017",
                "circle":"#FFD300",
                "district":"#00782A",
                "hammersmith-city":"#F3A9BB",
                "jubilee":"#A0A5A9",
                "metropolitan":"#9B0056",
                "northern":"#000000",
                "piccadilly":"#003688",
                "victoria":"#0098D4",
                "waterloo-city":"#95CDBA",
                "dlr":"#00A4A7",
                "pedestrian":"#ffffff"}

    def colour_node(G,n):
        ebunch = list(G.in_edges(n)) + list(G.out_edges(n))
        line_ids = list({G.edges[u,v]["line_id"] for (u,v) in ebunch})
        if len(line_ids)>1 or line_ids[0]=="pedestrian":
            return {"fill_colour":"#ffffff", "edge_colour":"#000000"}
        else:
            return {"fill_colour":mapping[line_ids[0]], "edge_colour":"#ffffff"}

    nx.set_edge_attributes(G, {(u,v):mapping[line_id] for (u,v,line_id) in G.edges.data("line_id")}, name="fill_colour")
    nx.set_edge_attributes(G, {(u,v):("#000000" if line_id=="pedestrian" else "#ffffff")
                                    for (u,v,line_id) in G.edges.data("line_id")}, name="edge_colour")
    nx.set_node_attributes(G, {u:colour_node(G,u)["fill_colour"] for u in G.nodes()}, name="fill_colour")
    nx.set_node_attributes(G, {u:colour_node(G,u)["edge_colour"] for u in G.nodes()}, name="edge_colour")

    return G

def k_shortest_paths(json_whole_network, source_val, target_val, k):

    # load the whole-network graph from json
    data = json.loads(json_whole_network)
    G = nx.readwrite.json_graph.node_link_graph(data)

    # find the k-shortest paths
    y = nx.shortest_simple_paths(G, source_val, target_val, weight="weight")
    k_shortest_paths = []
    while len(k_shortest_paths)<k:
        new_path = next(y)
        # doesn't share the same node names
        get_names = lambda path: [G.nodes[u]["name"] for u in path]
        new_names = get_names(new_path)
        old_names = [get_names(path) for path in k_shortest_paths]
        if not new_names in old_names:
            k_shortest_paths.append(new_path)

    # convert to a sub-graph
    ebunch = ((node1, node2, G.edges[node1,node2])
                for path in k_shortest_paths
                    for node1,node2 in zip(path[:-1],path[1:]))
    nbunch = ((node, G.nodes[node]) for path in k_shortest_paths for node in path)

    G_sub = nx.DiGraph()
    G_sub.add_edges_from(ebunch)
    nx.set_node_attributes(G_sub, {k:v for k,v in nbunch})

    G_sub = style_graph(G_sub)

    json_routes = nx.readwrite.json_graph.node_link_data(G_sub)

    return json_routes

def shortest_paths(json_whole_network, station_list):

    # load the whole-network graph from json
    data = json.loads(json_whole_network)
    G = nx.readwrite.json_graph.node_link_graph(data)

    # find the k-shortest paths
    shortest_paths = []
    for source_val in station_list:
        print("----------------")
        print(f"Source station: {source_val}")
        for target_val in station_list:
            path_not_found = True
            num_attempts = 0
            if target_val != source_val:
                print(f"Target station: {target_val}")
                y = nx.shortest_simple_paths(G, source_val, target_val, weight="weight")
                while path_not_found and num_attempts<3:
                    num_attempts += 1
                    new_path = next(y)
                    # doesn't share the same node names
                    get_names = lambda path: [G.nodes[u]["name"] for u in path]
                    new_names = get_names(new_path)
                    old_names = [get_names(path) for path in shortest_paths]
                    if not new_names in old_names:
                        shortest_paths.append(new_path)
                    path_not_found = False

    # convert to a sub-graph
    ebunch = ((node1, node2, G.edges[node1,node2])
                for path in shortest_paths
                    for node1,node2 in zip(path[:-1],path[1:]))
    nbunch = ((node, G.nodes[node]) for path in shortest_paths for node in path)

    G_sub = nx.DiGraph()
    G_sub.add_edges_from(ebunch)
    nx.set_node_attributes(G_sub, {k:v for k,v in nbunch})

    G_sub = style_graph(G_sub)

    json_routes = nx.readwrite.json_graph.node_link_data(G_sub)

    return json_routes