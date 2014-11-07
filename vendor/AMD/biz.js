define(['text!../templates/start.string', 'jquery'], function (template, jquery) {

    var $container = $('container');

    $container.append(template);
});