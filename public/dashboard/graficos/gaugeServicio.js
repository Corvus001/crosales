var gaugeNivelServicio = function (porcentajeActual, porcentajeAnterior, objetivo) {

    var div = document.getElementById('nivel_servicio');
    var svg = d3.select('#gauge_servicio').append('svg').attr('id', 'nivel_servicio_interno_redraw');

    function redraw() {
        d3.select('#nivel_servicio_interno_redraw').remove();
        var svg = d3.select('#gauge_servicio').append('svg').attr('id', 'nivel_servicio_interno_redraw');
        // TAMAÑO

        var width = div.clientWidth-20;
        var height = div.clientHeight-20;

        // tamaño svg
        svg.attr('width', width)
            .attr('height', height);

        svg.append('rect').attr('width', width).attr('height', height).attr('fill', 'transparent');

        

        // VALORES DEL GAUGE************
        var porcentajeEC = parseFloat(porcentajeActual.replace(',', '.')); // Porcentaje En curso
        var porcentajeA = parseFloat(porcentajeAnterior.replace(',','.')); // Porcentaje Anterior


        // Func. transforma Porcentajes a grados, donde 0% = -90 grados, 50% = 0 grados, 100% = 90 grados
        // Es asi porque d3 cuenta los grados desde el punto superior de un arco de circunferencia.
        function porcToDeg(porc) {
            return 180 * porc / 100 - 90;
        }

        // Variables que guardan los valores en grados del porcentaje y el target
        var angulo_lleno = porcToDeg(porcentajeEC);
        var angulo_objetivo = porcToDeg(objetivo);

        // Convierte de grados a radianes
        Math.radians = function (degrees) {
            return degrees * Math.PI / 180;
        };

        // Convierte de radianes a grados
        Math.degrees = function (radians) {
            return radians * 180 / Math.PI;
        };

        // RADIOS DEL GAUGE *************************
        var outer_radius = 0;
        if (width > height*2) {
            outer_radius = height * 0.8;
        } else if (height < width) {
            outer_radius = width / 2 * 0.8;
        }
        var inner_radius = outer_radius * 0.6;

        // GENERADOR DE ARCOS
        var arc = d3.arc().innerRadius(inner_radius).outerRadius(outer_radius);

        


        // SELECTOR AL g
        var arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(' + width / 2 + ',' + height + ')');


        // FONDO DEL GAUGE (pintamos todo de un color neutro primero, para luego pintar encima la seccion llena)
        arcs.append('path')
            .attr('fill', '#e9e9e9')
            .attr('d', arc({ startAngle: Math.radians(-90), endAngle: Math.radians(90) }));

        // SECCION LLENA DEL GAUGE
        var tuys = arcs.append('path')
            .attr('fill', '#1ed760')
            .attr('d', arc({ startAngle: Math.radians(-90), endAngle: Math.radians(-90) }));
        tuys.transition().duration(1000).attrTween('d', arcTween(Math.radians(angulo_lleno)))

        function arcTween(newAngle) {
            return function () {
                var interpolate = d3.interpolate(-90, angulo_lleno);

                return function (t) {

                    return arc({ startAngle: Math.radians(-90), endAngle: Math.radians(interpolate(t)) });
                }
            }
        }
        // DIBUJAR LA LINEA DEL TARGET

        // La siguiente variable guarda las coordenadas x e y del centro del segmento circular de la donut, que corresponderia
        // al target si fuera dibujado. De este modo obtenemos el punto al que apuntaria nuestra aguja indicadora (que nosotros no usamos)
        var centroid = arc.centroid({ startAngle: Math.radians(angulo_objetivo), endAngle: Math.radians(angulo_objetivo) });

        // A partir de la variable centroid, computamos las coordenadas de la interseccion de nuestr aguja indicadora hipotetica con
        // el radio interno y con el radio interno
        var x1 = centroid[0] * inner_radius * 1.02 / Math.sqrt(centroid[0] * centroid[0] + centroid[1] * centroid[1]);
        var y1 = centroid[1] * inner_radius * 1.02 / Math.sqrt(centroid[0] * centroid[0] + centroid[1] * centroid[1]);
        var x2 = centroid[0] * outer_radius * 0.98 / Math.sqrt(centroid[0] * centroid[0] + centroid[1] * centroid[1]);
        var y2 = centroid[1] * outer_radius * 0.98 / Math.sqrt(centroid[0] * centroid[0] + centroid[1] * centroid[1]);

        // Dibujamos nuestra linea de target
        var line = arcs.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', 'orangered')
            .attr('stroke-width', inner_radius * 0.05)
            .attr('stroke-linecap', 'round')
            .attr('stroke-dasharray', inner_radius * 0.05 + ',' + inner_radius * 0.1);

        // VALOR DEL PORCENTAJE EN CURSO
        var valorpec = arcs.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', -inner_radius*0.25)
            .attr('font-size', inner_radius * 0.45 + 'px')
            .attr('font-weight', 'bold')
            .attr('fill','black')
            .text(porcentajeEC + '%');

        // VALOR DEL PORCENTAJE ANTERIOR
        var valorpa = arcs.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', -inner_radius * 0.65)
            .attr('font-size', inner_radius * 0.125 + 'px')
            .attr('font-weight', 'bold')
            .attr('fill', '#626262')
            .text('Anterior: ' + porcentajeA + '%');


        // VALOR DEL TARGET
        var valort = arcs.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', -5)
            .attr('fill', 'orangered')
            .attr('font-size', inner_radius * 0.15 + 'px')
            //.attr('font-family', 'Courier')
            .attr('font-weight', 'bold')
            .text('Target: ' + objetivo + '%');

        svg.append('text')
            .attr('x', width * 0.05)
            .attr('y', width * 0.07)
            .attr('font-size', inner_radius * 0.25 + 'px')
            .attr('font-weight', 'bold')
            .attr('fill', 'black')
            .text('% Nivel de Servicio');
        tuys.on('mouseenter', function (d) { tuys.attr('opacity', '0.8'); }).on('mouseleave', function (d) { tuys.attr('opacity', '1'); });
    }
    redraw();
    window.addEventListener('resize', redraw);
};