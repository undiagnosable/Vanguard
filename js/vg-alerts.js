var vg = {};

vg.alert = {};

vg.alert.open = function(options) {
    var el;
    var settings = $.extend({
            append: true,
            parent: 'body',
            content: 'Some important message!',
            type: "normal",
            delay: 0
        }, options );
    el = $('<div style="display:none;" class="alert-box is-' + settings.type + '">' + settings.content + '<a class="alert-close">&times;</a></div>');
    if(settings.append) {
        el.appendTo(settings.parent);
    }
    else {
        el.prependTo(settings.parent);
    }
    el.slideDown(function () {
        el.trigger('vg-alert-open', el);
    });
    if(typeof settings.delay != 'undefined' && settings.delay != 0) {
        setTimeout(function () {
            vg.alert.close(el);
        }, parseInt(settings.delay));
    }
};

vg.alert.error = function (content, delay) {vg.alert.open({content: content, type: 'error', delay: delay})};
vg.alert.warning = function (content, delay) {vg.alert.open({content: content, type: 'warning', delay: delay})};
vg.alert.info = function (content, delay) {vg.alert.open({content: content, type: 'info', delay: delay})};
vg.alert.success = function (content, delay) {vg.alert.open({content: content, type: 'success', delay: delay})};

vg.alert.close = function (alert) {
    $(alert).slideUp('fast', function () {
        $(this).trigger('vg-alert-closed', alert).remove();
    });
};

$(document).on('click', '[data-alert]', function(e) {
    e.preventDefault();
    var el = $(this);
    var options = {
        append: $(el).data('alert-append'),
        content: $(el).data('alert-content'),
        type: $(el).data('alert-type'),
        parent: $(el).data('alert-parent'),
        delay: $(el).data('timeout')
    }
    vg.alert.open(options);
});

$(document).on('click', '.alert-close', function (e) {
    e.stopPropagation();
    e.preventDefault();
    vg.alert.close($(this).parents('.alert-box'));
});

$(document).ready(function(){
    $('.alert-box').each(function() {
        var delay = $(this).data('timeout');
        var el = $(this);
        if(typeof delay != 'undefined' && delay != 0) {
            setTimeout(function () {
                $(el).find('.alert-close').trigger('click');
            }, parseInt(delay));
        }
    });
});