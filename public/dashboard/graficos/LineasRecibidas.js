﻿var graficoLineasRecibidas = function (arreglo, titulo) {

    var div = document.getElementById('grafico_recibidas');
    var svg = d3.select('#recibidas_anual').append('svg').attr('id', 'recibidas_interno_redraw');
    // Funcion para agregar dias a una fecha
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
    //This takes care of automatically incrementing the month if necessary. For example:
    // 8 / 31 + 1 day will become 9/ 1.
    function redraw() {
        d3.select('#recibidas_interno_redraw').remove();
        var svg = d3.select('#recibidas_anual').append('svg').attr('id', 'recibidas_interno_redraw');
        // TAMAÑO
        var chart_width = div.clientWidth;
        var chart_height = div.clientHeight - 10;
        var margen = 40;
        var parseTime = d3.timeParse("%Y/%m/%d");
        var promediarDiasFaltantes = 1;

        // Texto de Nota

        svg.append('text')
            .attr('x', margen + 10)
            .attr('y', chart_height - 8)
            .attr('font-size', chart_width*0.015)
            .text('Nota: Este gráfico considera las llamadas que pasaron por al menos una cola.')



        // DATOS RECIBIDOS

        //var data2 = arreglo;

        var dataPrueba = [['2017/01/01', 245], ['2017/02/01', 279], ['2017/03/03', 265], ['2017/04/01', 243], ['2017/05/01', 250], ['2017/06/01', 265], ['2017/07/01', 190], ['2017/08/01', 298], ['2017/09/01', 256], ['2017/10/01', 242], ['2017/11/01', 278], ['2017/12/01', 400]];

        var data2 = dataPrueba;

        // ----------Promediar Dias Faltantes-------------------
        // LLENAR FECHAS FALTANTES EN LOS DATOS CON VALORES CERO
        if (promediarDiasFaltantes === 0) {
            for (var i = 0; i < data2.length; i++) {
                if (i === data2.length - 1) {
                    break;
                }
                var di = parseTime(data2[i][0]); // Date del primero
                var ds = parseTime(data2[i + 1][0]);  // Date del siguiente

                di = di.addDays(1);


                if (!(di.toDateString() === ds.toDateString())) {

                    // Inserta la fecha faltante con valor 0
                    data2.splice(i + 1, 0, [di.getFullYear() + '/' + (di.getMonth() + 1) + '/' + di.getDate(), 0]);

                    i = i - 1;
                }
            }
        }
        //-------------------------------------------------------
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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
            .range([margen, chart_width - 2 * margen]);


        var scale_y = d3.scaleLinear()
            .domain([0, ((max_value+1000)-(max_value%1000))]) // Por ejemplo: 24178 + 1000 = 25178 -> 25178 - (24178%1000) = 25000
            .range([chart_height - margen, margen]);            // Asi consigo que escale hasta el siguiente mil

        // -----------SVG-------------
        svg.attr('width', chart_width)
            .attr('height', chart_height);

        // ---------TITULO-----------
        svg.append('text')
            .attr('font-size', Math.floor(chart_width * 0.03))
            .attr('x', chart_width / 2)
            .attr('y', margen - 5)
            .attr('text-anchor', 'middle')
            .text(titulo)
            .attr('fill', 'black');



        // -------Line Generator------
        var line = d3.line()
            .y(function (d) {
                return scale_y(d[1]);
            })
            .x(function (d) {
                return scale_x(parseTime(d[0]));
            });

        //-------------O--------------

        var g = svg.append('g'); // ORIGEN SUPERIOR IZQUIERDO

        // EJE X, se dibuja de izquierda a derecha, 20 pixeles antes del borde inferior del svg
        // para dejar espacio para los numeros. Todo en SVG se dibuja a partir de la esquina
        // superior izquierda
        g.append('g')
            .attr('transform', 'translate(' + 0 + ',' + (chart_height - margen) + ')')
            .call(d3.axisBottom(scale_x));

        // EJE Y del grafico, se dibuja de arriba a abajo. A 20 pixeles del borde izquierdo
        g.append('g')
            .attr('transform', 'translate(' + margen + ',' + 0 + ')')
            .call(d3.axisLeft(scale_y).tickSize(-chart_width + 2 * margen).ticks(6))
            .selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");


        // Linea del grafico
        svg.append('path')
            .attr('d', line(data2))
            .attr('fill', 'none')
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3);

        // ----------- RESALTAR VALRO AL HACER MOUSE HOVER ----------


        formatCurrency = function (d) { return d; };

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5)
            .attr('fill', 'none')
            .attr('stroke', 'red');

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr('fill', 'black')
            .attr('stroke', '#0065FF')
            .attr("transform", "translate(-40," + (- 20) + ")");;;

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
            focus.select("text").text(formatCurrency(d[1]) + ', ' + d[0].substring(5,7));

        }
    }

    redraw();
    window.addEventListener("resize", redraw);
};