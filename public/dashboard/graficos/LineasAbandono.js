﻿var graficoLineasAbandono = function (arreglo1,arreglo2, titulo) {

    var div = document.getElementById('grafico_abandono');
    var svg = d3.select('#abandono_anual').append('svg').attr('id', 'abandono_interno_redraw');
    // Funcion para agregar dias a una fecha
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
    //This takes care of automatically incrementing the month if necessary. For example:
    // 8 / 31 + 1 day will become 9/ 1.
    function redraw() {
        d3.select('#abandono_interno_redraw').remove();
        var svg = d3.select('#abandono_anual').append('svg').attr('id', 'abandono_interno_redraw');
        // TAMAÑO
        var chart_width = div.clientWidth;
        var chart_height = div.clientHeight - 10;
        var margen = 40;
        var parseTime = d3.timeParse("%Y/%m/%d");
        var promediarDiasFaltantes = 1;
        // DATOS RECIBIDOS

        //var data1 = arreglo1;
        //var data2 = arreglo2;

        var dataPrueba = [['2017/01/01', 25], ['2017/02/01', 35], ['2017/03/01', 28], ['2017/04/01', 25], ['2017/05/01', 24], ['2017/06/01', 22], ['2017/07/01', 29], ['2017/08/01', 35], ['2017/09/01', 26], ['2017/10/01', 27], ['2017/11/01', 30], ['2017/12/01', 35]];
        var dataPrueba2 = [['2017/01/01', 75], ['2017/02/01', 65], ['2017/03/01', 72], ['2017/04/01', 75], ['2017/05/01', 76], ['2017/06/01', 78], ['2017/07/01', 71], ['2017/08/01', 65], ['2017/09/01', 74], ['2017/10/01', 73], ['2017/11/01', 70], ['2017/12/01', 65]];
        var data1 = dataPrueba;
        var data2 = dataPrueba2;
        
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
            .range([margen, chart_width - margen]);


        var scale_y = d3.scaleLinear()
            .domain([0, 100])
            .range([chart_height - margen, margen]);

        // -----------SVG-------------
        svg.attr('width', chart_width)
            .attr('height', chart_height);

        // ---------TITULO-----------
        svg.append('text')
            .attr('font-size', chart_width*0.03)
            .attr('x', chart_width / 2-50)
            .attr('y', margen - 5)
            .attr('text-anchor', 'middle')
            .text(titulo)
            .attr('fill', 'black');

        // LEYENDA
        svg.append('rect')
            .attr('fill', 'steelblue')
            .attr('height', 5)
            .attr('width', 5)
            .attr('x', chart_width - 100)
            .attr('y', 5);

        svg.append('text')
            .attr('fill', 'black')
            .attr('font-size', 10)
            .attr('x', chart_width - 90)
            .attr('y', 10)
            .text("Atencion");

        svg.append('rect')
            .attr('fill', 'orange')
            .attr('height', 5)
            .attr('width', 5)
            .attr('x', chart_width - 100)
            .attr('y', 15);

        svg.append('text')
            .attr('fill', 'black')
            .attr('font-size', 10)
            .attr('x', chart_width - 90)
            .attr('y', 20)
            .text("Abandono");


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


        // Linea 1 del grafico
        svg.append('path')
            .attr('d', line(data1))
            .attr('fill', 'none')
            .attr("stroke", "orange")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3);

        // Linea 2 del grafico
        svg.append('path')
            .attr('d', line(data2))
            .attr('fill', 'none')
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3);

        // ----------- RESALTAR VALRO AL HACER MOUSE HOVER ----------


        formatCurrency = function (d) { return d; };

        var focus1 = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        var focus2 = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus1.append("circle")
            .attr("r", 4.5)
            .attr('fill', 'none')
            .attr('stroke', 'red');

        focus2.append("circle")
            .attr("r", 4.5)
            .attr('fill', 'none')
            .attr('stroke', 'red');

        focus1.append("text")
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr('fill', 'black')
            .attr('stroke', '#0065FF')
            .attr("transform", "translate(-40," + (- 20) + ")");;

        focus2.append("text")
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr('fill', 'black')
            .attr('stroke', '#0065FF')
            .attr("transform", "translate(-40," + (- 20) + ")");;

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", chart_width)
            .attr("height", chart_height)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .on("mouseover", function () { focus1.style("display", null); focus2.style("display", null); })
            .on("mouseout", function () { focus1.style("display", "none"); focus2.style("display", "none"); })
            .on("mousemove", mousemove);

        var bisectDate = d3.bisector(function (d) { return parseTime(d[0]); }).right;
        function mousemove() {
            var x0 = scale_x.invert(d3.mouse(this)[0]); // Me devuelve la fecha correspondiente a la posicion del mouse
            var i = bisectDate(data2, x0);

            var d0 = data1[i - 1];
            var d1 = data1[i];
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
            var k = bisectDate(data1, x0);

            var r0 = data2[k - 1];
            var r1 = data2[k];
            try {
                var r;
                if (x0 - parseTime(r0[0]) > parseTime(r1[0]) - x0) {
                    r = r1;
                } else {
                    r = r0;
                }
            } catch (e) {
                if (r0 === null) {
                    r = r1;
                } else {
                    r = r0;
                }
            }

            focus1.attr("transform", "translate(" + scale_x(parseTime(d[0])) + "," + scale_y(d[1]) + ")");
            focus1.select("text").text(formatCurrency(d[1]) + '%, ' + d[0].substring(5,7));
            focus2.attr("transform", "translate(" + scale_x(parseTime(r[0])) + "," + scale_y(r[1]) + ")");
            focus2.select("text").text(formatCurrency(r[1]) + '%, ' + r[0].substring(5,7));

        }
    }

    redraw();
    window.addEventListener("resize", redraw);
};