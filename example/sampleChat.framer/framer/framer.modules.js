require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"chat":[function(require,module,exports){
var InputModule;

InputModule = require('input');

exports.Chat = (function() {
  var defaults;

  defaults = {
    fontSize: 24,
    lineHeight: 36,
    padding: 20,
    avatarSize: 60,
    inputBorderColor: '#ccc',
    inputHeight: 80,
    placeholder: 'Start chatting',
    defaultUserId: 1,
    bubbleColor: {
      right: '#4080FF',
      left: '#eee'
    },
    bubbleText: {
      right: 'white',
      left: 'black'
    },
    data: [
      {
        author: 1,
        message: 'Lorem ipsum dolor sit amet, ei has impetus vituperata adversarium, nihil populo semper eu ius, an eam vero sensibus.'
      }
    ],
    users: [
      {
        id: 1,
        name: 'Ningxia',
        avatar: 'ningxia.jpg'
      }
    ]
  };

  function Chat(options) {
    var createComment;
    if (options === void 0) {
      options = {};
    }
    options = _.defaults(options, defaults);
    this.options = options;
    this.commentsScroll = new ScrollComponent({
      name: 'comments',
      backgroundColor: null,
      width: Screen.width,
      height: Screen.height - this.options.inputHeight,
      mouseWheelEnabled: true,
      scrollHorizontal: false
    });
    this.commentsScroll.contentInset = {
      top: this.options.padding
    };
    this.renderComment = (function(_this) {
      return function(comment, align) {
        _this._messageSize = Utils.textSize(comment.message, {
          'padding': _this.options.padding + "px"
        }, {
          width: Screen.width * 0.6
        });
        _this._leftPadding = _this.options.padding * 2 + _this.options.avatarSize;
        _this._author = _.find(_this.options.users, {
          id: comment.author
        });
        _this.comment = new Layer({
          parent: _this.commentsScroll.content,
          name: 'comment',
          backgroundColor: null,
          width: Screen.width,
          height: _this._messageSize.height + _this.options.lineHeight * 2
        });
        _this.author = new Layer({
          name: 'comment:author',
          html: _this._author.name,
          parent: _this.comment,
          x: align === 'right' ? Align.right(-_this.options.padding) : _this._leftPadding,
          width: _this.comment.width,
          color: '#999',
          backgroundColor: null,
          style: {
            'font-weight': 'bold',
            'font-size': '90%',
            'text-align': align
          }
        });
        _this.message = new Layer({
          name: 'comment:message',
          parent: _this.comment,
          html: comment.message,
          height: _this._messageSize.height,
          y: _this.options.lineHeight,
          backgroundColor: _this.options.bubbleColor[align],
          color: _this.options.bubbleText[align],
          borderRadius: _this.options.padding,
          style: {
            'padding': _this.options.padding + "px",
            'width': 'auto',
            'max-width': _this._messageSize.width + "px",
            'text-align': align
          }
        });
        if (align === 'right') {
          _this._width = parseInt(_this.message.computedStyle()['width']);
          _this.message.x = Screen.width - _this._width - _this.options.padding;
        } else {
          _this.message.x = _this._leftPadding;
          _this.avatar = new Layer({
            parent: _this.comment,
            name: 'comment:avatar',
            size: _this.options.avatarSize,
            borderRadius: _this.options.avatarSize / 2,
            image: "images/" + _this._author.avatar,
            x: _this.options.padding,
            y: Align.bottom(-_this.options.padding * 2)
          });
        }
        return _this.reflow();
      };
    })(this);
    this.reflow = (function(_this) {
      return function() {
        var comment, commentsHeight, i, j, k, layer, len, len1, ref, ref1;
        _this.commentsHeight = 0;
        _this.comments = _this.commentsScroll.content.children;
        ref = _this.comments;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          comment = ref[i];
          commentsHeight = _this.commentsHeight + comment.height;
          _this.yOffset = 0;
          ref1 = _.take(_this.comments, i);
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            layer = ref1[k];
            _this.yOffset = _this.yOffset + layer.height;
          }
          comment.y = _this.yOffset;
        }
        _this.commentsScroll.updateContent();
        return _this.commentsScroll.scrollToLayer(_this.comments[_this.comments.length - 1]);
      };
    })(this);
    _.map(this.options.data, (function(_this) {
      return function(comment) {
        return _this.renderComment(comment, 'left');
      };
    })(this));
    this.inputWrapper = new Layer({
      name: 'input',
      backgroundColor: null,
      height: this.options.inputHeight,
      width: Screen.width,
      y: Align.bottom,
      style: {
        'border-top': "1px solid " + this.options.inputBorderColor
      }
    });
    this.input = new InputModule.Input({
      name: 'input:field',
      parent: this.inputWrapper,
      width: Screen.width,
      placeholder: this.options.placeholder,
      virtualKeyboard: false
    });
    createComment = (function(_this) {
      return function(value) {
        var newComment;
        newComment = {
          author: _this.options.defaultUserId,
          message: value
        };
        return _this.renderComment(newComment, 'right');
      };
    })(this);
    this.input.on('keyup', function(event) {
      if (event.which === 13) {
        createComment(this.value);
        return this.value = '';
      }
    });
    this.input.form.addEventListener('submit', function(event) {
      return event.preventDefault();
    });
  }

  return Chat;

})();


},{"input":"input"}],"input":[function(require,module,exports){
var growthRatio, imageHeight,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.keyboardLayer = new Layer({
  x: 0,
  y: Screen.height,
  width: Screen.width,
  height: 432,
  html: "<img style='width: 100%;' src='modules/keyboard.png'/>"
});

growthRatio = Screen.width / 732;

imageHeight = growthRatio * 432;

exports.keyboardLayer.states = {
  shown: {
    y: Screen.height - imageHeight
  }
};

exports.keyboardLayer.states.animationOptions = {
  curve: "spring(500,50,15)"
};

exports.Input = (function(superClass) {
  extend(Input, superClass);

  Input.define("style", {
    get: function() {
      return this.input.style;
    },
    set: function(value) {
      return _.extend(this.input.style, value);
    }
  });

  Input.define("value", {
    get: function() {
      return this.input.value;
    },
    set: function(value) {
      return this.input.value = value;
    }
  });

  function Input(options) {
    if (options == null) {
      options = {};
    }
    if (options.setup == null) {
      options.setup = false;
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.clip == null) {
      options.clip = false;
    }
    if (options.height == null) {
      options.height = 60;
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "rgba(255, 60, 47, .5)" : "transparent";
    }
    if (options.fontSize == null) {
      options.fontSize = 30;
    }
    if (options.lineHeight == null) {
      options.lineHeight = 30;
    }
    if (options.padding == null) {
      options.padding = 10;
    }
    if (options.text == null) {
      options.text = "";
    }
    if (options.placeholder == null) {
      options.placeholder = "";
    }
    if (options.virtualKeyboard == null) {
      options.virtualKeyboard = Utils.isMobile() ? false : true;
    }
    if (options.type == null) {
      options.type = "text";
    }
    if (options.goButton == null) {
      options.goButton = false;
    }
    Input.__super__.constructor.call(this, options);
    if (options.placeholderColor != null) {
      this.placeholderColor = options.placeholderColor;
    }
    this.input = document.createElement("input");
    this.input.id = "input-" + (_.now());
    this.input.style.cssText = "font-size: " + options.fontSize + "px; line-height: " + options.lineHeight + "px; padding: " + options.padding + "px; width: " + options.width + "px; height: " + options.height + "px; border: none; outline-width: 0; background-image: url(about:blank); background-color: " + options.backgroundColor + ";";
    this.input.value = options.text;
    this.input.type = options.type;
    this.input.placeholder = options.placeholder;
    this.form = document.createElement("form");
    if (options.goButton) {
      this.form.action = "#";
      this.form.addEventListener("submit", function(event) {
        return event.preventDefault();
      });
    }
    this.form.appendChild(this.input);
    this._element.appendChild(this.form);
    this.backgroundColor = "transparent";
    if (this.placeholderColor) {
      this.updatePlaceholderColor(options.placeholderColor);
    }
    if (!Utils.isMobile() && options.virtualKeyboard === true) {
      this.input.addEventListener("focus", function() {
        exports.keyboardLayer.bringToFront();
        return exports.keyboardLayer.states.next();
      });
      this.input.addEventListener("blur", function() {
        return exports.keyboardLayer.states["switch"]("default");
      });
    }
  }

  Input.prototype.updatePlaceholderColor = function(color) {
    var css;
    this.placeholderColor = color;
    if (this.pageStyle != null) {
      document.head.removeChild(this.pageStyle);
    }
    this.pageStyle = document.createElement("style");
    this.pageStyle.type = "text/css";
    css = "#" + this.input.id + "::-webkit-input-placeholder { color: " + this.placeholderColor + "; }";
    this.pageStyle.appendChild(document.createTextNode(css));
    return document.head.appendChild(this.pageStyle);
  };

  Input.prototype.focus = function() {
    return this.input.focus();
  };

  Input.prototype.onFocus = function(cb) {
    return this.input.addEventListener("focus", function() {
      return cb.apply(this);
    });
  };

  Input.prototype.onBlur = function(cb) {
    return this.input.addEventListener("blur", function() {
      return cb.apply(this);
    });
  };

  return Input;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2xpZWJjaGVuL0Ryb3Bib3ggKEZhY2Vib29rKS9QZXJzb25hbC9GcmFtZXIgY2hhdC9jaGF0TW9kdWxlLmZyYW1lci9tb2R1bGVzL2lucHV0LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2xpZWJjaGVuL0Ryb3Bib3ggKEZhY2Vib29rKS9QZXJzb25hbC9GcmFtZXIgY2hhdC9jaGF0TW9kdWxlLmZyYW1lci9tb2R1bGVzL2NoYXQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzLmtleWJvYXJkTGF5ZXIgPSBuZXcgTGF5ZXJcblx0eDowLCB5OlNjcmVlbi5oZWlnaHQsIHdpZHRoOlNjcmVlbi53aWR0aCwgaGVpZ2h0OjQzMlxuXHRodG1sOlwiPGltZyBzdHlsZT0nd2lkdGg6IDEwMCU7JyBzcmM9J21vZHVsZXMva2V5Ym9hcmQucG5nJy8+XCJcblxuI3NjcmVlbiB3aWR0aCB2cy4gc2l6ZSBvZiBpbWFnZSB3aWR0aFxuZ3Jvd3RoUmF0aW8gPSBTY3JlZW4ud2lkdGggLyA3MzJcbmltYWdlSGVpZ2h0ID0gZ3Jvd3RoUmF0aW8gKiA0MzJcblxuZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcyA9XG5cdHNob3duOiBcblx0XHR5OiBTY3JlZW4uaGVpZ2h0IC0gaW1hZ2VIZWlnaHRcblxuZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0Y3VydmU6IFwic3ByaW5nKDUwMCw1MCwxNSlcIlxuXG5jbGFzcyBleHBvcnRzLklucHV0IGV4dGVuZHMgTGF5ZXJcblx0QGRlZmluZSBcInN0eWxlXCIsXG5cdFx0Z2V0OiAtPiBAaW5wdXQuc3R5bGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdF8uZXh0ZW5kIEBpbnB1dC5zdHlsZSwgdmFsdWVcblxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IEBpbnB1dC52YWx1ZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QGlucHV0LnZhbHVlID0gdmFsdWVcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRvcHRpb25zLnNldHVwID89IGZhbHNlXG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmNsaXAgPz0gZmFsc2Vcblx0XHRvcHRpb25zLmhlaWdodCA/PSA2MFxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IGlmIG9wdGlvbnMuc2V0dXAgdGhlbiBcInJnYmEoMjU1LCA2MCwgNDcsIC41KVwiIGVsc2UgXCJ0cmFuc3BhcmVudFwiXG5cdFx0b3B0aW9ucy5mb250U2l6ZSA/PSAzMFxuXHRcdG9wdGlvbnMubGluZUhlaWdodCA/PSAzMFxuXHRcdG9wdGlvbnMucGFkZGluZyA/PSAxMFxuXHRcdG9wdGlvbnMudGV4dCA/PSBcIlwiXG5cdFx0b3B0aW9ucy5wbGFjZWhvbGRlciA/PSBcIlwiXG5cdFx0b3B0aW9ucy52aXJ0dWFsS2V5Ym9hcmQgPz0gaWYgVXRpbHMuaXNNb2JpbGUoKSB0aGVuIGZhbHNlIGVsc2UgdHJ1ZVxuXHRcdG9wdGlvbnMudHlwZSA/PSBcInRleHRcIlxuXHRcdG9wdGlvbnMuZ29CdXR0b24gPz0gZmFsc2VcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdEBwbGFjZWhvbGRlckNvbG9yID0gb3B0aW9ucy5wbGFjZWhvbGRlckNvbG9yIGlmIG9wdGlvbnMucGxhY2Vob2xkZXJDb2xvcj9cblx0XHRAaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiaW5wdXRcIlxuXHRcdEBpbnB1dC5pZCA9IFwiaW5wdXQtI3tfLm5vdygpfVwiXG5cdFx0QGlucHV0LnN0eWxlLmNzc1RleHQgPSBcImZvbnQtc2l6ZTogI3tvcHRpb25zLmZvbnRTaXplfXB4OyBsaW5lLWhlaWdodDogI3tvcHRpb25zLmxpbmVIZWlnaHR9cHg7IHBhZGRpbmc6ICN7b3B0aW9ucy5wYWRkaW5nfXB4OyB3aWR0aDogI3tvcHRpb25zLndpZHRofXB4OyBoZWlnaHQ6ICN7b3B0aW9ucy5oZWlnaHR9cHg7IGJvcmRlcjogbm9uZTsgb3V0bGluZS13aWR0aDogMDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKGFib3V0OmJsYW5rKTsgYmFja2dyb3VuZC1jb2xvcjogI3tvcHRpb25zLmJhY2tncm91bmRDb2xvcn07XCJcblx0XHRAaW5wdXQudmFsdWUgPSBvcHRpb25zLnRleHRcblx0XHRAaW5wdXQudHlwZSA9IG9wdGlvbnMudHlwZVxuXHRcdEBpbnB1dC5wbGFjZWhvbGRlciA9IG9wdGlvbnMucGxhY2Vob2xkZXJcblx0XHRAZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJmb3JtXCJcblxuXHRcdGlmIG9wdGlvbnMuZ29CdXR0b25cblx0XHRcdEBmb3JtLmFjdGlvbiA9IFwiI1wiXG5cdFx0XHRAZm9ybS5hZGRFdmVudExpc3RlbmVyIFwic3VibWl0XCIsIChldmVudCkgLT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0QGZvcm0uYXBwZW5kQ2hpbGQgQGlucHV0XG5cdFx0QF9lbGVtZW50LmFwcGVuZENoaWxkIEBmb3JtXG5cblx0XHRAYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QHVwZGF0ZVBsYWNlaG9sZGVyQ29sb3Igb3B0aW9ucy5wbGFjZWhvbGRlckNvbG9yIGlmIEBwbGFjZWhvbGRlckNvbG9yXG5cblx0XHQjb25seSBzaG93IGhvbm9yIHZpcnR1YWwga2V5Ym9hcmQgb3B0aW9uIHdoZW4gbm90IG9uIG1vYmlsZSxcblx0XHQjb3RoZXJ3aXNlIGlnbm9yZVxuXHRcdGlmICFVdGlscy5pc01vYmlsZSgpICYmIG9wdGlvbnMudmlydHVhbEtleWJvYXJkIGlzIHRydWVcblx0XHRcdEBpbnB1dC5hZGRFdmVudExpc3RlbmVyIFwiZm9jdXNcIiwgLT5cblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRcdGV4cG9ydHMua2V5Ym9hcmRMYXllci5zdGF0ZXMubmV4dCgpXG5cdFx0XHRAaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciBcImJsdXJcIiwgLT5cblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcy5zd2l0Y2ggXCJkZWZhdWx0XCJcblxuXHR1cGRhdGVQbGFjZWhvbGRlckNvbG9yOiAoY29sb3IpIC0+XG5cdFx0QHBsYWNlaG9sZGVyQ29sb3IgPSBjb2xvclxuXHRcdGlmIEBwYWdlU3R5bGU/XG5cdFx0XHRkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkIEBwYWdlU3R5bGVcblx0XHRAcGFnZVN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInN0eWxlXCJcblx0XHRAcGFnZVN0eWxlLnR5cGUgPSBcInRleHQvY3NzXCJcblx0XHRjc3MgPSBcIiMje0BpbnB1dC5pZH06Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogI3tAcGxhY2Vob2xkZXJDb2xvcn07IH1cIlxuXHRcdEBwYWdlU3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUgY3NzKVxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQgQHBhZ2VTdHlsZVxuXG5cdGZvY3VzOiAoKSAtPlxuXHRcdEBpbnB1dC5mb2N1cygpXG5cblx0b25Gb2N1czogKGNiKSAtPlxuXHRcdEBpbnB1dC5hZGRFdmVudExpc3RlbmVyIFwiZm9jdXNcIiwgLT5cblx0XHRcdGNiLmFwcGx5KEApXG5cblx0b25CbHVyOiAoY2IpIC0+XG5cdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJibHVyXCIsIC0+XG5cdFx0XHRjYi5hcHBseShAKVxuIiwiSW5wdXRNb2R1bGUgPSByZXF1aXJlICdpbnB1dCdcblxuY2xhc3MgZXhwb3J0cy5DaGF0XG5cdGRlZmF1bHRzID1cblx0XHRmb250U2l6ZTogMjRcblx0XHRsaW5lSGVpZ2h0OiAzNlxuXHRcdHBhZGRpbmc6IDIwXG5cdFx0YXZhdGFyU2l6ZTogNjBcblx0XHRpbnB1dEJvcmRlckNvbG9yOiAnI2NjYydcblx0XHRpbnB1dEhlaWdodDogODBcblx0XHRwbGFjZWhvbGRlcjogJ1N0YXJ0IGNoYXR0aW5nJ1xuXHRcdGRlZmF1bHRVc2VySWQ6IDFcblx0XHRidWJibGVDb2xvcjpcblx0XHRcdHJpZ2h0OiAnIzQwODBGRidcblx0XHRcdGxlZnQ6ICcjZWVlJ1xuXHRcdGJ1YmJsZVRleHQ6XG5cdFx0XHRyaWdodDogJ3doaXRlJ1xuXHRcdFx0bGVmdDogJ2JsYWNrJ1xuXHRcdGRhdGE6IFtcblx0XHRcdHtcblx0XHRcdFx0YXV0aG9yOiAxXG5cdFx0XHRcdG1lc3NhZ2U6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgZWkgaGFzIGltcGV0dXMgdml0dXBlcmF0YSBhZHZlcnNhcml1bSwgbmloaWwgcG9wdWxvIHNlbXBlciBldSBpdXMsIGFuIGVhbSB2ZXJvIHNlbnNpYnVzLidcblx0XHRcdH1cblx0XHRdXG5cdFx0dXNlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0aWQ6IDFcblx0XHRcdFx0bmFtZTogJ05pbmd4aWEnXG5cdFx0XHRcdGF2YXRhcjogJ25pbmd4aWEuanBnJ1xuXHRcdFx0fVxuXHRcdF1cblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0aWYgb3B0aW9ucyA9PSB1bmRlZmluZWQgdGhlbiBvcHRpb25zID0ge31cblx0XHRvcHRpb25zID0gXy5kZWZhdWx0cyBvcHRpb25zLCBkZWZhdWx0c1xuXHRcdEBvcHRpb25zID0gb3B0aW9uc1xuXG5cdFx0QGNvbW1lbnRzU2Nyb2xsID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0bmFtZTogJ2NvbW1lbnRzJ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHQgLSBAb3B0aW9ucy5pbnB1dEhlaWdodFxuXHRcdFx0bW91c2VXaGVlbEVuYWJsZWQ6IHRydWVcblx0XHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG5cblx0XHRAY29tbWVudHNTY3JvbGwuY29udGVudEluc2V0ID1cblx0XHRcdHRvcDogQG9wdGlvbnMucGFkZGluZ1xuXG5cdFx0QHJlbmRlckNvbW1lbnQgPSAoY29tbWVudCwgYWxpZ24pID0+XG5cdFx0XHQjIENhbGN1YXRlIHRoZSBtZXNzYWdlIHNpemVcblx0XHRcdEBfbWVzc2FnZVNpemUgPSBVdGlscy50ZXh0U2l6ZSBjb21tZW50Lm1lc3NhZ2UsXG5cdFx0XHRcdHsncGFkZGluZyc6IFwiI3tAb3B0aW9ucy5wYWRkaW5nfXB4XCJ9LFxuXHRcdFx0XHR7d2lkdGg6IFNjcmVlbi53aWR0aCAqIDAuNn1cblxuXHRcdFx0QF9sZWZ0UGFkZGluZyA9IEBvcHRpb25zLnBhZGRpbmcgKiAyICsgQG9wdGlvbnMuYXZhdGFyU2l6ZVxuXG5cdFx0XHQjIEZpbmQgdGhlIGF1dGhvclxuXHRcdFx0QF9hdXRob3IgPSBfLmZpbmQgQG9wdGlvbnMudXNlcnMsIHtpZDogY29tbWVudC5hdXRob3J9XG5cblx0XHRcdCMgQ29uc3RydWN0IHRoZSBjb21tZW50XG5cdFx0XHRAY29tbWVudCA9IG5ldyBMYXllclxuXHRcdFx0XHRwYXJlbnQ6IEBjb21tZW50c1Njcm9sbC5jb250ZW50XG5cdFx0XHRcdG5hbWU6ICdjb21tZW50J1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IEBfbWVzc2FnZVNpemUuaGVpZ2h0ICsgQG9wdGlvbnMubGluZUhlaWdodCAqIDJcblxuXHRcdFx0QGF1dGhvciA9IG5ldyBMYXllclxuXHRcdFx0XHRuYW1lOiAnY29tbWVudDphdXRob3InXG5cdFx0XHRcdGh0bWw6IEBfYXV0aG9yLm5hbWVcblx0XHRcdFx0cGFyZW50OiBAY29tbWVudFxuXHRcdFx0XHR4OiBpZiBhbGlnbiBpcyAncmlnaHQnIHRoZW4gQWxpZ24ucmlnaHQoLUBvcHRpb25zLnBhZGRpbmcpIGVsc2UgQF9sZWZ0UGFkZGluZ1xuXHRcdFx0XHR3aWR0aDogQGNvbW1lbnQud2lkdGhcblx0XHRcdFx0Y29sb3I6ICcjOTk5J1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0J2ZvbnQtd2VpZ2h0JzogJ2JvbGQnXG5cdFx0XHRcdFx0J2ZvbnQtc2l6ZSc6ICc5MCUnXG5cdFx0XHRcdFx0J3RleHQtYWxpZ24nOiBhbGlnblxuXG5cblx0XHRcdEBtZXNzYWdlID0gbmV3IExheWVyXG5cdFx0XHRcdG5hbWU6ICdjb21tZW50Om1lc3NhZ2UnXG5cdFx0XHRcdHBhcmVudDogQGNvbW1lbnRcblx0XHRcdFx0aHRtbDogY29tbWVudC5tZXNzYWdlXG5cdFx0XHRcdGhlaWdodDogQF9tZXNzYWdlU2l6ZS5oZWlnaHRcblx0XHRcdFx0eTogQG9wdGlvbnMubGluZUhlaWdodFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IEBvcHRpb25zLmJ1YmJsZUNvbG9yW2FsaWduXVxuXHRcdFx0XHRjb2xvcjogQG9wdGlvbnMuYnViYmxlVGV4dFthbGlnbl1cblx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBAb3B0aW9ucy5wYWRkaW5nXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdCdwYWRkaW5nJzogXCIje0BvcHRpb25zLnBhZGRpbmd9cHhcIlxuXHRcdFx0XHRcdCd3aWR0aCc6ICdhdXRvJ1xuXHRcdFx0XHRcdCdtYXgtd2lkdGgnOiBcIiN7QF9tZXNzYWdlU2l6ZS53aWR0aH1weFwiXG5cdFx0XHRcdFx0J3RleHQtYWxpZ24nOiBhbGlnblxuXG5cdFx0XHRpZiBhbGlnbiBpcyAncmlnaHQnXG5cdFx0XHRcdEBfd2lkdGggPSBwYXJzZUludCBAbWVzc2FnZS5jb21wdXRlZFN0eWxlKClbJ3dpZHRoJ11cblx0XHRcdFx0QG1lc3NhZ2UueCA9IFNjcmVlbi53aWR0aCAtIEBfd2lkdGggLSBAb3B0aW9ucy5wYWRkaW5nXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEAubWVzc2FnZS54ID0gQF9sZWZ0UGFkZGluZ1xuXG5cdFx0XHRcdEBhdmF0YXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRwYXJlbnQ6IEBjb21tZW50XG5cdFx0XHRcdFx0bmFtZTogJ2NvbW1lbnQ6YXZhdGFyJ1xuXHRcdFx0XHRcdHNpemU6IEBvcHRpb25zLmF2YXRhclNpemVcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IEBvcHRpb25zLmF2YXRhclNpemUgLyAyXG5cdFx0XHRcdFx0aW1hZ2U6IFwiaW1hZ2VzLyN7QF9hdXRob3IuYXZhdGFyfVwiXG5cdFx0XHRcdFx0eDogQG9wdGlvbnMucGFkZGluZ1xuXHRcdFx0XHRcdHk6IEFsaWduLmJvdHRvbSgtQG9wdGlvbnMucGFkZGluZyAqIDIpXG5cblx0XHRcdEByZWZsb3coKVxuXG5cdFx0QHJlZmxvdyA9ICgpID0+XG5cdFx0XHRAY29tbWVudHNIZWlnaHQgPSAwXG5cdFx0XHRAY29tbWVudHMgPSBAY29tbWVudHNTY3JvbGwuY29udGVudC5jaGlsZHJlblxuXG5cdFx0XHQjIExvb3AgdGhyb3VnaCBhbGwgdGhlIGNvbW1lbnRzXG5cdFx0XHRmb3IgY29tbWVudCwgaSBpbiBAY29tbWVudHNcblx0XHRcdFx0Y29tbWVudHNIZWlnaHQgPSBAY29tbWVudHNIZWlnaHQgKyBjb21tZW50LmhlaWdodFxuXHRcdFx0XHRAeU9mZnNldCA9IDBcblxuXHRcdFx0XHQjIEFkZCB1cCB0aGUgaGVpZ2h0IG9mIHRoZSBzaWJsaW5nIGxheWVycyB0byB0aGUgbGVmdCBvZiB0aGUgY3VycmVudCBsYXllclxuXHRcdFx0XHRmb3IgbGF5ZXIgaW4gXy50YWtlKEBjb21tZW50cywgaSlcblx0XHRcdFx0XHRAeU9mZnNldCA9IEB5T2Zmc2V0ICsgbGF5ZXIuaGVpZ2h0XG5cblx0XHRcdFx0IyBTZXQgdGhlIGN1cnJlbnQgY29tbWVudCBwb3NpdGlvbiB0byB0aGUgaGVpZ2h0IG9mIGxlZnQgc2libGluZ3Ncblx0XHRcdFx0Y29tbWVudC55ID0gQHlPZmZzZXRcblxuXHRcdFx0IyBTY3JvbGwgc3R1ZmZcblx0XHRcdEBjb21tZW50c1Njcm9sbC51cGRhdGVDb250ZW50KClcblx0XHRcdEBjb21tZW50c1Njcm9sbC5zY3JvbGxUb0xheWVyIEBjb21tZW50c1tAY29tbWVudHMubGVuZ3RoIC0gMV1cblxuXG5cdFx0IyBEcmF3IGV2ZXJ5dGhpbmdcblx0XHRfLm1hcCBAb3B0aW9ucy5kYXRhLCAoY29tbWVudCkgPT5cblx0XHRcdEByZW5kZXJDb21tZW50KGNvbW1lbnQsICdsZWZ0JylcblxuXG5cdFx0IyBOZXcgY29tbXBlbnRzXG5cdFx0QGlucHV0V3JhcHBlciA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJ2lucHV0J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHRoZWlnaHQ6IEBvcHRpb25zLmlucHV0SGVpZ2h0XG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHR5OiBBbGlnbi5ib3R0b21cblx0XHRcdHN0eWxlOlxuXHRcdFx0XHQnYm9yZGVyLXRvcCc6IFwiMXB4IHNvbGlkICN7QG9wdGlvbnMuaW5wdXRCb3JkZXJDb2xvcn1cIlxuXG5cdFx0QGlucHV0ID0gbmV3IElucHV0TW9kdWxlLklucHV0XG5cdFx0XHRuYW1lOiAnaW5wdXQ6ZmllbGQnXG5cdFx0XHRwYXJlbnQ6IEBpbnB1dFdyYXBwZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdHBsYWNlaG9sZGVyOiBAb3B0aW9ucy5wbGFjZWhvbGRlclxuXHRcdFx0dmlydHVhbEtleWJvYXJkOiBmYWxzZVxuXG5cdFx0Y3JlYXRlQ29tbWVudCA9ICh2YWx1ZSkgPT5cblx0XHRcdG5ld0NvbW1lbnQgPVxuXHRcdFx0XHRhdXRob3I6IEBvcHRpb25zLmRlZmF1bHRVc2VySWQsXG5cdFx0XHRcdG1lc3NhZ2U6IHZhbHVlXG5cblx0XHRcdEByZW5kZXJDb21tZW50IG5ld0NvbW1lbnQsICdyaWdodCdcblxuXHRcdEBpbnB1dC5vbiAna2V5dXAnLCAoZXZlbnQpIC0+XG5cdFx0XHQjIEFkZCBuZXcgY29tbWVudHNcblx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDEzXG5cdFx0XHRcdGNyZWF0ZUNvbW1lbnQoQHZhbHVlKVxuXHRcdFx0XHRAdmFsdWUgPSAnJ1xuXG5cdFx0QGlucHV0LmZvcm0uYWRkRXZlbnRMaXN0ZW5lciAnc3VibWl0JywgKGV2ZW50KSAtPlxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURBQSxJQUFBOztBQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsT0FBUjs7QUFFUixPQUFPLENBQUM7QUFDYixNQUFBOztFQUFBLFFBQUEsR0FDQztJQUFBLFFBQUEsRUFBVSxFQUFWO0lBQ0EsVUFBQSxFQUFZLEVBRFo7SUFFQSxPQUFBLEVBQVMsRUFGVDtJQUdBLFVBQUEsRUFBWSxFQUhaO0lBSUEsZ0JBQUEsRUFBa0Is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
