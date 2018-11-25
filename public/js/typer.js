$(function () {
    $.fn.typer = function(text, options){
        options = $.extend({}, {
            char: ' ',
            delay: 1000,
            duration: 100,
            endless: false
        }, options || text);

        text = $.isPlainObject(text) ? options.text : text;

        var elem = $(this),
            isTag = false,
            c = 0;
        
        (function typetext(i) {
            var e = ({string:1, number:1}[typeof text] ? text : text[i]) + options.char,
                char = e.substr(c++, 1);

            if( char === '<' ){ isTag = true; }
            if( char === '>' ){ isTag = false; }
            elem.html(e.substr(0, c));
            if(c <= e.length){
                if( isTag ){
                    typetext(i);
                } else {
                    setTimeout(typetext, options.duration/10, i);
                }
            } else {
                c = 0;
                i++;
                
                if (i === text.length && !options.endless) {
                    return;
                } else if (i === text.length) {
                    i = 0;
                }
                setTimeout(typetext, options.delay, i);
            }
        })(0);
    };

    $.fn.typerSlow = function(text, options){
        options = $.extend({}, {
            char: ' ',
            delay: 6000,
            duration: 1500,
            endless: false
        }, options || text);

        text = $.isPlainObject(text) ? options.text : text;

        var elem = $(this),
            isTag = false,
            c = 0;
        
        (function typetext(i) {
            var e = ({string:1, number:1}[typeof text] ? text : text[i]) + options.char,
                char = e.substr(c++, 1);

            if( char === '<' ){ isTag = true; }
            if( char === '>' ){ isTag = false; }
            elem.html(e.substr(0, c));
            if(c <= e.length){
                if( isTag ){
                    typetext(i);
                } else {
                    setTimeout(typetext, options.duration/10, i);
                }
            } else {
                c = 0;
                i++;
                
                if (i === text.length && !options.endless) {
                    return;
                } else if (i === text.length) {
                    i = 0;
                }
                setTimeout(typetext, options.delay, i);
            }
        })(0);
    };


    const text = '<h3 class="pb-5" style="text-align: center; font-weight: bolder;">Arquitectura</h3><p style="text-align: justify">Esta página está montada sobre un servidor HTTP corriendo sobre Node.JS, en los servidores de Heroku. En el back-end usé ExpressJS como framework para montar un servidor HTTP sirviendo contenido estático, no require base de datos. Por otro lado, en el front-end usé Bootstrap 4 y tomé ideas prestadas de otras páginas de desarrolladores y plantillas de Bootstrap, aunque la totalidad del código en JavaScript, CSS y HTML lo escribí a mano, sin uso de Frameworks.</p><p style="text-align: justify"> Adicionalmente, se puede acceder a un sistema de Chat diseñado y montado entéramente por mí, usando en principio Socket.io, DialogFlow, plataforma de Google en la nube para procesamiento de lenguaje natural, y una arquitectura basada en la idea de ser Plug & Play para el cliente, es decir, para montar este sistema de chatbot, el cliente solo necesita incluir en su página un script de menos de 20 líneas, tener Jquery, y agregar un iFrame que apunte a mi servidor.</p><p style="text-align: justify">Las respuestas del Bot son personalisables, y además es capaz de consultar APIs o Bases de Datos externas.</p><p style="text-align: justify"> Finalmente, puedes pedirle al bot contactar conmigo, y te permitirá enviarme un mensaje que me llegará instantáneamente a mi Smartphone. Toda la arquitectura y documentación de este sistema la puedes revisar en la sección Portafolio, donde podrás comprobar mis conocimientos del sistema y la forma en que lo construí. </p>'

    $('#typer-arquitectura').typer([text]);
    $('#typewriter').typerSlow('Developer');
});