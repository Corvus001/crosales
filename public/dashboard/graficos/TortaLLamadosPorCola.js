
var daedalus12 = function (array) {

    var div = document.getElementById('grafico_colas');
    var svg = d3.select('#torta_colas').append('svg').attr('id', 'torta_interno_redraw');
    //var data = array;
    var data = [['Front_Office', 9741, 92], ['VQ_Front_Argentina', 4599, 92], ['VQ_DesbordeArg_Switch', 895, 92], ['008_AntofaSuc', 695, 92], ['VQ_CSC_INT', 612, 92], ['VQ_DesbordeChile_Switch', 417, 92], ['VQ_BackOffice_Arg', 383, 92], ['VQ_Makgt_Arg', 318, 92], ['VQ_Suc_BuenosAires', 302, 92], ['033_Iquique', 298, 92]];
    var total = 0;
    var titulo = "Distribución de llamados por Cola último mes";
    for (var i = 0; i < data.length; i++) {
        total += data[i][1];
    }
    function redraw() {
        d3.select('#torta_interno_redraw').remove();
        var svg = d3.select('#torta_colas').append('svg').attr('id', 'torta_interno_redraw');
        
        
        

        

        var chart_width = div.clientWidth;
        var chart_height = div.clientHeight;


        var menor = chart_height;
        if (chart_width < chart_height) {
            menor = chart_width;
        }

        // Generador de radianes
        var pie = d3.pie().value(function (d, i) { return d[1]; });
        // Radion interno y externo
        var inner_radius = menor*0.2;
        var outer_radius = menor*0.4;

        // Generador de PATHS
        var arc = d3.arc().innerRadius(inner_radius).outerRadius(outer_radius).padAngle(0.01);

        // Posicion del centro de la donut
        var donut_center_x = outer_radius*1.1;
        var donut_center_y = outer_radius * 1.3;

        // Texto de colas no consideradas

        svg.append('text')
            .attr('x', 20)
            .attr('y', div.clientHeight - 20)
            .attr('fill', 'black')
            .attr('font-size', chart_width * 0.015)
            .text('* ' + data[0][2] + ' colas con menos de 100 llamados al mes no mostradas. El total señalado corresponde a la suma de llamados de estas colas.');
        svg.append('text')
            .attr('x', 20)
            .attr('y', div.clientHeight - 10)
            .attr('fill', 'black')
            .attr('font-size', chart_width * 0.015)
            .text('Para obtener los llamados de las '+data[0][2]+' colas restantes, puede restar el total señalado arriba de los llamados recibidos el ultimo mes.');


        // Declaracion de los arcos
        var arcs = svg.selectAll('g.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('transform',
            'translate(' + donut_center_x + ',' + donut_center_y + ')');


        var colores = d3.scaleOrdinal(d3.schemeCategory20);

        // Dibujacion de los arcos
        arcs.append('path')
            .classed('donut', true)
            .attr('fill', function (d, i) { return d3.schemeCategory20[i]; })
            .attr('d', arc);

      
        // Leyenda de Colores
        arcs.append('rect')
            .attr('fill', function (d, i) { return d3.schemeCategory20[i]; })
            .attr('x', outer_radius + 20)
            .attr('y', function (d, i) { return i * 12 - outer_radius + 10; })
            .attr('width', 10)
            .attr('height', 10);


        arcs.append('text')
            .attr('x', outer_radius + 32)
            .attr('y', function (d, i) { return i * 12 - outer_radius + 16; })
            .attr('fill', 'black')
            .attr('font-size', outer_radius*0.06)
            .text(function (d, i) {
                return d.data[0];
            });
        // Circulo Interno
        var center = svg
            .append('circle')
            .attr('r', inner_radius - 4)
            .attr('cx', donut_center_x)
            .attr('cy', donut_center_y)
            .attr('fill', '#C7C7c7');
        // Texto del total
        var text = svg.append('text')
            .text(function (d) { return 'Total: ' + total; })
            .attr('x', donut_center_x)
            .attr('y', donut_center_y - 15)
            .attr('font-size', outer_radius*0.1)
            .attr('text-anchor', 'middle')
            .style('pointer-events', 'none');

        // Nombre de la cola
        var nombre_cola = svg.append('text')
            .data(data)
            .text("")
            .attr('x', donut_center_x)
            .attr('y', donut_center_y - 45)
            .attr('font-size', outer_radius*0.08)
            .attr('text-anchor', 'middle')
            .style('pointer-events', 'none');

        // Porcentaje
        var porcentaje = svg.append('text')
            .text("")
            .attr('x', donut_center_x)
            .attr('y', donut_center_y+45)
            .attr('font-size', outer_radius * 0.08)
            .attr('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .attr('fill','steelblue');


        // Contador
        var suma = 0;
        var contador = svg.append('text')
            .classed('contador', true)
            .attr('x', donut_center_x)
            .attr('y', donut_center_y + 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', outer_radius*0.09)
            .attr('fill', 'white')
            .style('pointer-events', 'none');

        // Titulo
        svg.append('text')
            .text(titulo)
            .attr('x', donut_center_x*1.5)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', outer_radius*0.12);

        //Animaciones
        var new_radius;
        var clicked = 0;
        d3.selectAll('svg circle').on(
            'mouseenter', function () {
                d3.select(this).attr('opacity', 0.8);
            }
        ).on(
            'mouseleave', function (d, i) {
                d3.select(this).attr('opacity', 1);
            });


        d3.selectAll('.donut').on(
            "click", function (d, i) {

                if (!d3.select(this).classed('clicked')) { // Si no esta clickeado
                    new_radius = outer_radius * 1.08;
                    arc.outerRadius(new_radius);
                    d3.select(this)
                        .classed('clicked', true)
                        .transition()
                        .duration(500)
                        .ease(d3.easePolyInOut)
                        .attr('d', arc(d));
                    // Agregar texto contador.
                    suma += d.value;
                    contador.text(suma + ' llamados.');
                    porcentaje.text((suma / total * 100).toFixed(1)+'%');


                } else {

                    new_radius = outer_radius * 1.08 * 0.926;
                    arc.outerRadius(new_radius);
                    d3.select(this)
                        .classed('clicked', false)
                        .transition()
                        .duration(100)
                        .attr('d', arc(d));
                    // Borrar el contador
                    suma -= d.value;
                    if (suma === 0) {
                        svg.select('text.contador').text('');
                        porcentaje.text('');
                    } else {
                        svg.select('text.contador').text(suma + ' llamados.');
                        porcentaje.text((suma / total * 100).toFixed(1) + '%');
                    }

                }

                //},
                //"mouseenter": function () {

                //    d3.select(this).attr('opacity', 0.7);
                //},
                //"mouseleave": function () {
                //    d3.select(this).attr('opacity', 1);
                //}


            }).on('mouseenter', function (d, i) {
                nombre_cola.text(d.data[0]);
                d3.select(this).attr('opacity', '0.9');

            }).on('mouseleave', function () {
                nombre_cola.text('');
                d3.select(this).attr('opacity', '1');
            });
    }
    redraw();
    window.addEventListener("resize", redraw);
};