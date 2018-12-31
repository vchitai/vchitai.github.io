
d3.select("#start_btn").on("click", function () {
    $('#collapseThree').collapse('show');
    $('#collapseFour').collapse('show');
    node_number = $("input#node_number").val();
    if (node_number == undefined || node_number == '') {
        alert('Enter something pls');
        return;
    }
    node_data = [];
    for (var i = 0; i < node_number; i++) {
        node_data.push(i);
    }
    var community = jLouvain()
        .nodes(node_data)
        .edges(edge_data);

    //Drawing code
    var width = 500;
    var height = 500;
    edge_data = [];
    node_data.forEach(function (x) {
        a = getRandomSubarray(node_data, getRandomInt(3));
        a.forEach(function (b) {
            edge_data.push({
                source: x,
                target: b,
                weight: getRandomFloat(2)
            })
        });
    })
    var Xstring = ""
    edge_data.forEach(function (e) {
        Xstring += "<tr><td>" + e.source + "</td><td>" + e.target + "</td><td>" + e.weight + "</td></tr>"
    })
    $("#tableX").html(Xstring);
    $('#nodes-btn').text(node_number + ' Nodes')



    var original_node_data = d3.entries(node_data);
    var max_weight = d3.max(edge_data, function (d) {
        return d.weight;
    });
    var weight_scale = d3.scale
        .linear()
        .domain([0, max_weight])
        .range([1, 5]);

    var force = d3.layout
        .force()
        .charge(-100)
        .linkDistance(20)
        .size([width, height]);
    $(".content-wrapper").empty();
    var svg = d3
        .select(".content-wrapper")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    // createTable([node_data]);
    // createTableFromX(edge_data);

    force
        .nodes(original_node_data)
        .links(edge_data)
        .start();

    var link = svg
        .selectAll(".link")
        .data(edge_data)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return weight_scale(d.weight);
        });

    var node = svg
        .selectAll(".node")
        .data(force.nodes())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", "#a30500")
        .call(force.drag);

    var lables = node.append("text")
    .text(function(d) {
      return d.key;
    })
    .attr('x', 6)
    .attr('y', 3);


    node.append("title")
    .text(function(d) { return d.key; });

    force.on("tick", function () {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
            lables
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
    });

    d3.select("#comm_detect").on("click", function () {
        $('#collapseTwo').collapse('show');
        visualize_speed = $('#visualize_speed').val() * 1000;
        var myVar = setInterval(function () {
            //Communnity detection on click event
            var community_assignment_result = community.nextStep();
            if (community_assignment_result == undefined) {
                clearInterval(myVar);
            }
            var node_ids = Object.keys(community_assignment_result);

            communities = {}
            Object.keys(community_assignment_result).forEach(function (k) {
                if (community_assignment_result[k] in communities) {
                    communities[community_assignment_result[k]].push(k);
                } else {
                    communities[community_assignment_result[k]] = [k];
                }
            });
            var Ystring = ""
            Object.keys(communities).forEach(function (k) {
                Ystring += "<tr><td>" + k + "</td><td>" + communities[k] + "</td></tr>"
            })
            $('#tableY').html(Ystring);
            var max_community_number = 0;
            node_ids.forEach(function (d) {
                original_node_data[d].community = community_assignment_result[d];
                max_community_number =
                    max_community_number < community_assignment_result[d] ?
                        community_assignment_result[d] :
                        max_community_number;
            });

            max_community_number = Object.keys(communities).length
            $('#communities-btn').text(max_community_number + ' Communities Discovered')
            var color = d3.scale
                .category20()
                .domain(d3.range([0, max_community_number]));

            d3.selectAll(".node")
                .data(original_node_data)
                .style("fill", function (d) {
                    return color(d.community);
                });
        }, visualize_speed);
    });

    d3.select("#reset_btn").on("click", function () {
        d3.selectAll(".node")
            .data(original_node_data)
            .style("fill", "#a30500");
        community.resetAll();
    });
});