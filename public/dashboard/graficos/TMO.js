var TMOUA = function (arreglo, TMOAnterior, TMOEnCurso) {

    var div = document.getElementById('grafico_tmo');
    var svg = d3.select('#tmo').append('svg').attr('id', 'tmo_interno_redraw')
    function redraw() {
        d3.select('#tmo_interno_redraw').remove();
        var svg = d3.select('#tmo').append('svg').attr('id', 'tmo_interno_redraw');
        // TAMAÑO
        var chart_width = div.clientWidth;
        var chart_height = div.clientHeight;
        var margen = 40;        
        var y_offset = 50;      // Basicamente con esta variable logramos que el grafico sea más pequeño dentro del div que lo contiene.
        var parseTime = d3.timeParse("%Y/%m/%d");
        var promediarDiasFaltantes = 1;
        // DATOS RECIBIDOS
        var dataPrueba = [['2017/01/01', 245], ['2017/02/01', 279], ['2017/03/01', 265], ['2017/04/01', 243], ['2017/05/01', 250], ['2017/06/01', 265], ['2017/07/01', 190], ['2017/08/01', 298], ['2017/09/01', 256], ['2017/10/01', 242], ['2017/11/01', 278], ['2017/12/01', 400]];
        var data2 = dataPrueba;

        // Computar valor maximo
        var max_value = 0;
        for (i = 0; i < data2.length; i++) {
            if (data2[i][1] > max_value) {
                max_value = data2[i][1];
            }
        }
        // ---------ESCALAS------------
        var scale_x = d3.scaleTime()
            .domain([parseTime(data2[0][0]), parseTime(data2[data2.length - 1][0])])   // AHORA SI :D
            .range([margen, chart_width -  margen]);


        var scale_y = d3.scaleLinear()
            .domain([0, ((max_value + 100) - (max_value % 100))])
            .range([chart_height - margen - y_offset, margen]);            

        // -----------SVG-------------
        svg.attr('width', chart_width)
            .attr('height', chart_height);

        

        // -------Line Generator------
        var line = d3.area()
            .y0(function (d) {
                return scale_y(0);
            })
            .y1(function (d) {
                return scale_y(d[1]);
            })
            .x(function (d) {
                return scale_x(parseTime(d[0]));
            });

        //-------------O--------------

        var g = svg.append('g').attr('transform', 'translate(' + 0 + ',' + y_offset + ')'); // ORIGEN SUPERIOR IZQUIERDO

        // EJE X, se dibuja de izquierda a derecha, 20 pixeles antes del borde inferior del svg
        // para dejar espacio para los numeros. Todo en SVG se dibuja a partir de la esquina
        // superior izquierda
        g.append('g')
            .attr('transform', 'translate(' + 0 + ',' + (chart_height - margen - y_offset) + ')')
            .call(d3.axisBottom(scale_x));

        // EJE Y del grafico, se dibuja de arriba a abajo. A 20 pixeles del borde izquierdo
        g.append('g')
            .attr('transform', 'translate(' + margen + ',' + 0 + ')')
            .call(d3.axisLeft(scale_y).tickSize(-chart_width + 2 * margen).ticks(6))
            .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");


        // Linea del grafico
        svg.append('path')
            .attr('d', line(data2))
            .attr('fill', 'steelblue')
            .attr('opacity',0.5)
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr('transform', 'translate(' + 0 + ',' + y_offset + ')');



        // ----------- RESALTAR VALRO AL HACER MOUSE HOVER ----------
        formatCurrency = function (d) { return d; };

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr('transform', 'translate(' + 0 + ',' + y_offset + ')')
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5)
            .attr('fill', 'none')
            .attr('stroke', 'red').attr('transform', 'translate(' + 0 + ',' + y_offset + ')');

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr('fill', 'black')
            .attr('stroke', '#0065FF' )
            .attr("transform", "translate(-40," + (y_offset-20)+ ")"); // Muevo el texto hacia la izquierda para que el texto del valor a la derecha del grafico se muestre correctamente. 
            // O dicho de otra forma; muevo el texto hacia la izquierda para centrarlo sobre el circulo rojo,


        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", chart_width)
            .attr("height", chart_height)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .on("mouseover", function () { focus.style("display", null); })
            .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        var bisectDate = d3.bisector(function (d) { return parseTime(d[0]); }).right;
        function mousemove() {
            var x0 = scale_x.invert(d3.mouse(this)[0]); // Me devuelve la fecha correspondiente a la posicion del mouse
            var i = bisectDate(data2, x0);

            var d0 = data2[i - 1];
            var d1 = data2[i];
            try {
                var d;
                if (x0 - parseTime(d0[0]) > parseTime(d1[0]) - x0) {
                    d = d1;
                } else {
                    d = d0;
                }
            } catch (e) {
                if (d0 === null) {
                    d = d1;
                } else {
                    d = d0;
                }
            }

            focus.attr("transform", "translate(" + scale_x(parseTime(d[0])) + "," + scale_y(d[1]) + ")");
            focus.select("text").text(formatCurrency(d[1]) + ', ' + d[0].substring(0));
            
        }
        var menor = chart_height;
        if (chart_width < chart_height) menor = chart_width;
        
        // DIBUJAR DESCRIPCION
        svg.append('text')
            .attr('x', div.clientWidth / 2)
            .attr('y', div.clientHeight * 0.1)
            .attr('text-anchor','middle')
            .attr('font-size', menor * 0.08)
            .attr('font-weight', 'bold')
            .text('TMO Mes en Curso');
        // DIBUJAR TMO EN CURSO
        svg.append('text')
            .attr('x', div.clientWidth / 2)
            .attr('y', div.clientHeight*0.31)
            .attr('text-anchor','middle')
            .attr('font-size', chart_width/menor*24 )
            .attr('font-weight', 'bold')
            .attr('id', 'xkcd')
            .text(TMOEnCurso + 's');
        svg.append('text')
            .attr('x', div.clientWidth / 2)
            .attr('y', div.clientHeight * 0.41)
            .attr('text-anchor', 'middle')
            .attr('font-size', chart_width / menor * 6)
            .attr('font-weight', 'bold')
            .attr('id', 'variacion_ua')
            .text('Variación del último año');

        if (chart_width / menor * 24 > 52) d3.select('#xkcd').attr('font-size', 52);
        if (chart_width / menor * 24 > 52) d3.select('#variacion_ua').attr('font-size', 16);
    }

    redraw();
    window.addEventListener("resize", redraw);
};


