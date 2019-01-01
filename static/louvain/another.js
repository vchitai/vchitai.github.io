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

    edge_data = [];
    node_data.forEach(function (x) {
        a = getRandomSubarray(node_data, getRandomInt($('#neighbours').val()));
        v = getRandomFloat($('#weight').val())
        a.forEach(function (b) {
            edge_data.push({
                source: x,
                target: b,
                value: v,
                weight: v
            })
        });
    })
    community = jLouvain()
        .nodes(node_data)
        .edges(edge_data);

    //Drawing code
    var width = 500;
    var height = 500;
    var Xstring = ""
    edge_data.forEach(function (e) {
        Xstring += "<tr><td>" + e.source + "</td><td>" + e.target + "</td><td>" + e.value + "</td></tr>"
    })
    $("#tableX").html(Xstring);
    $('#nodes-btn').text(node_number + ' Nodes')


    var original_node_data = d3.entries(node_data);
    original_node_data.pop();
    const simulation = d3.forceSimulation(original_node_data)
        .force("link", d3.forceLink(edge_data).id(d => d.key))
        .force("charge", d3.forceManyBody().strength($('#repel-force').val()))
        .force("center", d3.forceCenter(width / 2, height / 2));
    var color = '#a30500';
    $(".content-wrapper").empty();
    var svg = d3
        .select(".content-wrapper")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(edge_data)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

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
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(original_node_data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", color)
        .call(drag(simulation));

    const text = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(original_node_data)
        .enter().append("text")
        .attr("dx", -9)
        .attr("dy", "-.35em")
        .text(function (d) { return d.key });

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text.attr("x", d => d.x)
            .attr("y", d => d.y);
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
            var color = d3.scaleSequential(d3.interpolateRainbow).domain([0,max_community_number]);

            svg.selectAll("circle")
                .data(original_node_data)
                .attr("fill", d => color(d.community));
        }, visualize_speed);
    });

    d3.select("#reset_btn").on("click", function () {
        svg.selectAll("circle")
            .data(original_node_data)
            .attr("fill", "#a30500");
        community.resetAll();
    });
});