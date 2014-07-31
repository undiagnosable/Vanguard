var vg = vg || {};

vg.dialog = new function () { };

vg.dialog.isOpening = false;

vg.dialog.open = function (options) {
    
    if (vg.dialog.isOpening) return
    vg.dialog.isOpening = true;
    var dialog = '',
        title = '',
        content = '',
        lightbox = '';

    var settings = $.extend({
        content: 'Pass a URL, inline element or content',
        title: false,
        parent: 'body',
        type: 'normal',
        class: '',
        width: 'auto',
        height: 'auto',
        origin: false,
        callback: false,
        params: false,
        namespace: '.vg-dialog',
        customEvent: 'vg-dialog-custom',
        image: false,
        method: 'get', // soon...
        scroll: 'inner', // scroll in or out of the dialog (inner/outer)
        lightbox: false,
        closeOnSubmit: true,
        redirectOnSubmit: false
    }, options);

    if (settings.title) {
        title = '<h3 class="vg-dialog-title">' + settings.title + '</h3>';
    }
    settings.lightbox ? lightbox = " vg-dialog-lightbox" : lightbox = " vg-dialog-modal";
    settings.dialog = '<div class="vg-dialog-base' + ' vg-dialog-scroll-' + settings.scroll + lightbox + '">' +
                        '<div class="vg-dialog is-' + settings.type + ' ' + settings.class + '" style="width:'+ settings.width +'; height:'+ settings.height +';">' +
                            title +
                            '<a class="vg-dialog-close vg-close" href="#">&times;</a>' +
                            '<div class="vg-dialog-content"></div>' +
                        '</div>' +
                    '</div>';


    if (settings.content.substring(0, 1) == "#") {
        content = $(settings.content).html();
        settings.inlineContent = $(settings.content).html();
        settings.inlineSelector = settings.content;
        $(settings.content).html('');
        settings.dialog = $(settings.dialog).find('.vg-dialog-content').html(content).end();
        var el = vg.dialog.show(settings);
        return $(el);
    }
    else if (settings.content.substring(0, 1) == "/" || settings.content.substring(0, 4) == "http") {
        $.get(settings.content, function (data) {
            content = data;
            settings.dialog = $(settings.dialog).find('.vg-dialog-content').html(content).end();
            var el = vg.dialog.show(settings);
            return $(el);
        })
        .fail(function () {
            content = 'Ooops!';
        });
    }
    else {
        content = settings.content;
        settings.dialog = $(settings.dialog).find('.vg-dialog-content').html(content).end();
        var el = vg.dialog.show(settings);
        return $(el);
    }
};

vg.dialog.show = function (settings, callback) {
    vg.dialog.isOpening = false;
    var el = $(settings.dialog).appendTo(settings.parent).data('dialog-settings', settings)
    .delay(1)
    .queue(function (next) {
        $(this).addClass('vg-dialog-open')
        .trigger('vg-dialog-open', $(settings.dialog))
        .trigger(settings.customEvent + '.vg-dialog-open', $(settings.dialog));
        next();
    });
    if ($(el).find('.vg-dialog').outerHeight() < $(window).height()) {
        $(el).find('.vg-dialog').addClass('vg-dialog-center');
    }
    $('body').addClass('vg-dialog-visible');
    return el;
};

vg.dialog.close = function (settings) {
    $(settings.dialog)
    .trigger('vg-dialog-close', $(settings.dialog));
};

vg.dialog.closeActive = function (el, ns) {
    var dialog;
    var namespace = '';
    if (typeof ns != 'undefined') {
        namespace = ns;
    }
    if (typeof el == 'undefined') {
        dialog = $('.vg-dialog-base:last');
    }
    $(dialog)
    .trigger('vg-dialog-close', $(dialog))
    .trigger(namespace + '.vg-dialog-close', $(dialog))
    .delay(1)
    .queue(function (next) {
        $(this).removeClass('vg-dialog-open');
        next();
    })
    .delay(300)
    .queue(function (next) {
        $(this).remove();
        next();
    });
    return dialog;
};



$.fn.dialogTitle = function (title) {
    var el = $(this).find('.vg-dialog-title');
    if (typeof title == "undefined") {
        return el.html();
    }
    else {
        return el.html(title);
    }
};

$.fn.dialogContent = function (content) {
    var el = $(this).find('.vg-dialog-content');
    if (typeof content == "undefined") {
        return el.html();
    }
    else {
        return el.html(content);
    }
};


$(document).on('vg-dialog-close', '.vg-dialog-base', function (e) {
    if (e.isDefaultPrevented()) {
        console.log('You shall not pass');
        return;
    }
    var el = $(this);
    var ev = $(this).data('dialog-settings').customEvent;
    $(this)
    .delay(1)
    .queue(function (next) {
        $(this).removeClass('vg-dialog-open');
        next();
    })
    .delay(300)
    .queue(function (next) {
        $(this)
        .trigger(ev + '.vg-dialog-close', el)
        .remove();
        next();
    });
    if (typeof $(this).data('dialog-settings').inlineContent != 'undefined' && typeof $(this).data('dialog-settings').inlineSelector != 'undefined') {
        $($(this).data('dialog-settings').inlineSelector).html($(this).data('dialog-settings').inlineContent);
    }
    $('body').delay(400).queue(function (next) {
        if ($('body').children('.vg-dialog-base').length == 0) {
            $(this).removeClass('vg-dialog-visible');
        }
        next();
    });
});

$(document).on('click.vg-dialog.vg-dialog-open', '[data-dialog]', function (e) {
    e.preventDefault();
    var el = $(this);
    //var content = el.data('dialog');
    //if (typeof content === 'undefined' || content === '') {
    //    content = el.attr('href');
    //}
    
    var options = {
        content: el.data('dialog'),
        title: el.data('dialog-title'),
        parent: el.data('dialog-parent'),
        type: el.data('dialog-type'),
        class: el.data('dialog-class'),
        width: el.data('dialog-width'),
        height:el.data('dialog-height'),
        origin: el,
        callback: el.data('dialog-callback'),
        params: el.data('dialog-params'),
        namespace: el.data('dialog-namespace'),
        image: el.data('dialog-image'),
        method: el.data('dialog-method'),
        scroll: el.data('dialog-scroll'),
        lightbox: el.data('dialog-lightbox'),
        closeOnSubmit: el.data('dialog-close-submit'),
        redirectOnSubmit: el.data('dialog-redirect-submit')
    };

    vg.dialog.open(options);
});


$(document).on('click.vg-dialog.vg-dialog-close', '.vg-dialog-close, .vg-dialog-cancel', function (e) {
    e.preventDefault();
    var options = $(this).parents('.vg-dialog-base').data('dialog-settings');
    vg.dialog.close(options);
});


$(document).on('click.vg-dialog.vg-dialog-close', '.vg-dialog-base.vg-dialog-lightbox', function (e) {
    e.preventDefault();
    var options = $(this).data('dialog-settings');
    vg.dialog.close(options);
});

$(document).on('click.vg-dialog.vg-dialog-prevent-close', '.vg-dialog-base.vg-dialog-lightbox .vg-dialog', function (e) {
    e.stopPropagation();
});

$(document).on('submit', '.vg-dialog form', function (e) {
    
    e.preventDefault();
    var el = $(this);
    var settings = el.parents('.vg-dialog-base').data('dialog-settings');
    var formData = el.serialize();
    var url = el.attr('action');
    $.post(url, formData, function (data, status, xhr) {
        debugger;
        if (settings.closeOnSubmit == true) {
            vg.dialog.close(settings);
        }
        else if (settings.redirectOnSubmit == false || (settings.redirectOnSubmit !== "undefined" && settings.redirectOnSubmit !== "")) {
            window.location.href = settings.redirectOnSubmit;
        }
    });
});