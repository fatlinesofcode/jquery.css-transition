var CssEase = {};
(function ($) {
    /*
     * $(elm).cssTransition({opacity:0, time:1.5, ease:CssEase.linear, onComplete:onHideComplete})
     */
    $.fn.trans = function () {
        if (!arguments)
            return;
        if (arguments.length < 1)
            return;
        var callback = null;
        var duratation;
        var delay;
        var cssFixClass;
        var cssProperties = jQuery.extend({}, arguments[0]);
        if (cssProperties.time) {
            // log("36","cssTransition","time", ""+parseFloat(properties.time) );
            var time = parseFloat(cssProperties.time) + "s";
            duratation = parseFloat(cssProperties.time) * 1000;
            var ease = cssProperties.ease || 'linear';
            callback = cssProperties.onComplete || null;
            cssFixClass = cssProperties.cssFixClass || "transition-fix";
            delay = parseFloat(cssProperties.delay) || 0;
            delete cssProperties.time;
            delete cssProperties.onComplete;
            delete cssProperties.delay;
            delete cssProperties.cssFixClass;
            delete cssProperties.ease;
            var definition = "";
            for (var i in cssProperties) {
                var prop = getVendorProperty(i)
                definition += prop + " " + time + " " + ease + " " + delay + "s, ";
            }
            definition = definition.substr(0, definition.length - 2);
        } else if (arguments[1]) {

            definition = arguments[1];
        }
        if (transitionSupported())
            getVendorTransition(definition, cssProperties)

        return this.each(function (index, elm) {
            //var that = elm;
            if (transitionSupported()) {
                if (callback) {
                    elm.callbackTriggered = false;
                    elm.onComplete = function (e) {
                        if (!elm.callbackTriggered) {
                            callback(e);
                            elm.callbackTriggered = true;
                        }
                    }
                    $(this).unbind(getVendorEvent('transitionend'));
                    $(this).bind(getVendorEvent('transitionend'), elm.onComplete);
                }
                if(cssFixClass){
                    $(this).addClass(cssFixClass);
                }
                $(this).css(cssProperties);
            } else {
                var that = this;
                setTimeout(function () {
                    $(that).animate(cssProperties, { queue:false, duration:duratation, easing:'linear', complete:callback })
                }, delay * 1000);

            }
        });
    };
    $.fn.clearTransition = function () {
        $(this).clearCallback()
        $(this).defineTransition('none');
    }
    $.fn.clearCallback = function () {

        $(this).unbind(getVendorEvent('transitionend'));
    }
    /*
     $(elm).defineTransition('none');
     $(elm).defineTransition('opacity 1s linear');
     */
    $.fn.defineTransition = function () {
        var args = [].splice.call(arguments, 0);
        var definition = args.join(" ")
        return this.each(function (index, elm) {
            $(this).css(getVendorTransition(definition));
        });
    };


    var CUBIC_BEZIER_OPEN = 'cubic-bezier(';
    var CUBIC_BEZIER_CLOSE = ')';
    CssEase = {
        bounce:CUBIC_BEZIER_OPEN + '0.0, 0.35, .5, 1.3' + CUBIC_BEZIER_CLOSE,
        linear:'linear',
        swing:'ease-in-out',
        easeInOut:'ease-in-out',
        easeIn:'ease-in',
        easeOut:'ease-out',

        // Penner equation approximations from Matthew Lein's Ceaser: http://matthewlein.com/ceaser/
        easeInQuad:CUBIC_BEZIER_OPEN + '0.550, 0.085, 0.680, 0.530' + CUBIC_BEZIER_CLOSE,
        easeInCubic:CUBIC_BEZIER_OPEN + '0.550, 0.055, 0.675, 0.190' + CUBIC_BEZIER_CLOSE,
        easeInQuart:CUBIC_BEZIER_OPEN + '0.895, 0.030, 0.685, 0.220' + CUBIC_BEZIER_CLOSE,
        easeInQuint:CUBIC_BEZIER_OPEN + '0.755, 0.050, 0.855, 0.060' + CUBIC_BEZIER_CLOSE,
        easeInSine:CUBIC_BEZIER_OPEN + '0.470, 0.000, 0.745, 0.715' + CUBIC_BEZIER_CLOSE,
        easeInExpo:CUBIC_BEZIER_OPEN + '0.950, 0.050, 0.795, 0.035' + CUBIC_BEZIER_CLOSE,
        easeInCirc:CUBIC_BEZIER_OPEN + '0.600, 0.040, 0.980, 0.335' + CUBIC_BEZIER_CLOSE,
        easeInBack:CUBIC_BEZIER_OPEN + '0.600, -0.280, 0.735, 0.045' + CUBIC_BEZIER_CLOSE,
        easeOutQuad:CUBIC_BEZIER_OPEN + '0.250, 0.460, 0.450, 0.940' + CUBIC_BEZIER_CLOSE,
        easeOutCubic:CUBIC_BEZIER_OPEN + '0.215, 0.610, 0.355, 1.000' + CUBIC_BEZIER_CLOSE,
        easeOutQuart:CUBIC_BEZIER_OPEN + '0.165, 0.840, 0.440, 1.000' + CUBIC_BEZIER_CLOSE,
        easeOutQuint:CUBIC_BEZIER_OPEN + '0.230, 1.000, 0.320, 1.000' + CUBIC_BEZIER_CLOSE,
        easeOutSine:CUBIC_BEZIER_OPEN + '0.390, 0.575, 0.565, 1.000' + CUBIC_BEZIER_CLOSE,
        easeOutExpo:CUBIC_BEZIER_OPEN + '0.190, 1.000, 0.220, 1.000' + CUBIC_BEZIER_CLOSE,
        easeOutCirc:CUBIC_BEZIER_OPEN + '0.075, 0.820, 0.165, 1.000' + CUBIC_BEZIER_CLOSE,
        easeOutBack:CUBIC_BEZIER_OPEN + '0.175, 0.885, 0.320, 1.275' + CUBIC_BEZIER_CLOSE,
        easeInOutQuad:CUBIC_BEZIER_OPEN + '0.455, 0.030, 0.515, 0.955' + CUBIC_BEZIER_CLOSE,
        easeInOutCubic:CUBIC_BEZIER_OPEN + '0.645, 0.045, 0.355, 1.000' + CUBIC_BEZIER_CLOSE,
        easeInOutQuart:CUBIC_BEZIER_OPEN + '0.770, 0.000, 0.175, 1.000' + CUBIC_BEZIER_CLOSE,
        easeInOutQuint:CUBIC_BEZIER_OPEN + '0.860, 0.000, 0.070, 1.000' + CUBIC_BEZIER_CLOSE,
        easeInOutSine:CUBIC_BEZIER_OPEN + '0.445, 0.050, 0.550, 0.950' + CUBIC_BEZIER_CLOSE,
        easeInOutExpo:CUBIC_BEZIER_OPEN + '1.000, 0.000, 0.000, 1.000' + CUBIC_BEZIER_CLOSE,
        easeInOutCirc:CUBIC_BEZIER_OPEN + '0.785, 0.135, 0.150, 0.860' + CUBIC_BEZIER_CLOSE,
        easeInOutBack:CUBIC_BEZIER_OPEN + '0.680, -0.550, 0.265, 1.550' + CUBIC_BEZIER_CLOSE
    }
    var getVendorProperty = function (name) {
        var browser = getVendorName();
        if (name == 'transform') {
            switch (browser) {
            case 'mozilla':
                name = '-moz-transform';
                break;
            case 'webkit':
                name = 'webkitTransitionEnd';
                break;
            case 'opera':
                name = 'oTransitionEnd';
                break;
            case 'msie':
                name = 'MSTransitionEnd';
                break;
            default:
                name = 'transitionend';
                break;
            }
        }
        return name;
    }
    var getVendorEvent = function (name) {
        var browser = getVendorName();
        if (name == 'transitionend') {
            switch (browser) {
            case 'mozilla':
                name = 'transitionend';
                break;
            case 'webkit':
                name = 'webkitTransitionEnd';
                break;
            case 'opera':
                name = 'oTransitionEnd';
                break;
            case 'msie':
                name = 'MSTransitionEnd';
                break;
            default:
                name = 'transitionend';
                break;
            }
        }
        return name;
    }
    var getVendorName = function () {
        return jQuery.uaMatch(navigator.userAgent).browser;
    }
    var transitionSupported = function () {
        //  return false;
        if (($.browser.msie && parseInt($.browser.version) < 10))
            return false;
        else
            return true;
    }
    var getVendorTransition = function () {
        var definition = arguments[0];
        var obj = arguments[1] ? arguments[1] : {};
        var browser = getVendorName();
        switch (browser) {
        case 'mozilla':
            obj['-moz-transition'] = definition;
            break;
        case 'webkit':
            obj['-webkit-transition'] = definition;
            break;
        case 'opera':
            obj['-o-transition'] = definition;
            break;
        case 'msie':
            obj['-ms-transition'] = definition;
            break;
        default:
            obj['transition'] = definition;
            break;
        }

        return obj;
    }


})(jQuery);