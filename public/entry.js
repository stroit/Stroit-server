var $ = require('jquery');
window.jQuery = $;

require('./animate.css');
require('./animate.js');
require('./pure.js');
require('./getPoints.js');
require('./initMap.js')
require('./style.css');

$('document').on('click', '.way-wrapper', function(e) {
    please($(this).index());
    e.preventDefault();
})
