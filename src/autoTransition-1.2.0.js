/**
 * autoTransition-1.2.0.js
 *
 * A JavaScript/CSS3 microlibrary for animating elements.
 *
 */

var autoTransition = new function () {

  // Browser compatibility
  var ele = document.createElement('div'),
    style = ele.style,
    prefix;

  if ('transform' in style) {
    prefix = '';
  }
  else if ('WebkitTransform' in style) {
    prefix = '-webkit-';
  }
  else if ('MozTransform' in style) {
    prefix = '-moz-';
  }
  else if ('msTransform' in style) {
    prefix = '-ms-';
  }
  else if ('OTransform' in style) {
    prefix = '-o-';
  }

  this.animate = function (className) {
    var elements = setElements(className);

    for (var i = 0; i < elements.length; i++) {
      var animations = getAnimations(elements[i]);
      var transitions = [];
      var animation;
      var froms = [];

      if (animations.length != 0 && animations[0].from == null) {
        for (var j = 0; j < animations.length; j++) {
          animation = animations[j];
          transitions[transitions.length] = [
            animation.property,
            animation.duration,
            animation.timmingFunction,
            animation.delay
          ].join(' ');
          froms[froms.length] = animation.element['style'][animation.property];
          animation.element['style'][animation.property] = animation.to;
        }
        animation.element.setAttribute('data-aT-from', froms.join(','));
        animation.element.style[prefix + 'transition'] = transitions.join(',');

        if (animation.onStart) {
          var onStart = window[animation.onStart];
          onStart();
        }

        if (animation.onEnd) {
          animation.element.addEventListener('webkitTransitionEnd', window[animation.onEnd], false);
        }
      }
    }
  };

  this.reset = function (className) {
    var elements = setElements(className);

    for (var i = 0; i < elements.length; i++) {
      var animations = getAnimations(elements[i]);
      var animation;

      if (animations.length != 0 && animations[0].from != null) {
        for (var j = 0; j < animations.length; j++) {
          animation = animations[j];
          animation.element['style'][animation.property] = animation.from;
        }
        animation.element.removeAttribute('data-aT-from');
        animation.element.style[prefix + 'transition'] = '';
      }
    }
  };

  //private
  function getElements(className) {
    return window['elements-' + className];
  }

  function setElements(className) {
    window['elements-' + className] = document.querySelectorAll(className);
    return getElements(className);
  }

  function getAnimations(element) {
    var elementsAttributes = [];
    var properties = extractAttributes(element, 'data-aT-property') || [];
    var tos = extractAttributes(element, 'data-aT-to');
    var froms = extractAttributes(element, 'data-aT-from');
    var delays = extractAttributes(element, 'data-aT-delay');
    var durations = extractAttributes(element, 'data-aT-duration');
    var timmingFunctions = extractAttributes(element, 'data-aT-timing-function');
    var onEnds = extractAttributes(element, 'data-aT-onEnd');
    var onStarts = extractAttributes(element, 'data-aT-onStart');

    for (var i = 0; i < properties.length; i++) {
      elementsAttributes[elementsAttributes.length] = {
        element: element,
        property: properties[i],
        from: froms ? froms[i] : null,
        to: tos ? parseTo(tos[i], properties[i]) : 0,
        delay: parseTime(delays ? delays[i] : '0'),
        duration: parseTime(durations ? durations[i] : '300'),
        onEnd: onEnds ? onEnds[i] : null,
        onStart: onStarts ? onStarts[i] : null,
        timmingFunction: timmingFunctions ? timmingFunctions[i] : 'ease'
      }
    }

    return elementsAttributes;
  }

  function extractAttributes(element, attribute) {
    var attr = element.getAttribute(attribute);
    return attr != null ? attr.split(',') : null;
  }

  function parseTo(to, property) {
    if (property == 'width' ||
      property == 'height' ||
      property == 'top' ||
      property == 'right' ||
      property == 'bottom' ||
      property == 'left') {
      if (!to.match(/px$/)) {
        return to + 'px';
      }
    }
    return to;
  }

  function parseTime(time) {
    if (!time.match(/ms$/) && !time.match(/s$/)) {
      return time + 'ms';
    }
    return time;
  }
};

autoTransition.animate('.autoTransition');
