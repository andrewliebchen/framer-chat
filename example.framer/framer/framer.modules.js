require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"chat":[function(require,module,exports){
var InputModule;

InputModule = require('input');

exports.Chat = (function() {
  var defaults;

  defaults = {
    fontSize: 24,
    lineHeight: 36,
    padding: 20,
    borderRadius: 20,
    maxWidth: Screen.width * 0.6,
    avatarSize: 60,
    avatarBorderRadius: 30,
    inputBorderColor: '#ccc',
    inputHeight: 80,
    placeholder: 'Start chatting',
    defaultUserId: 1,
    authorTextColor: '#999',
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
    this._group = 0;
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
        var obj, obj1, obj2;
        _this._messageSize = Utils.textSize(comment.message, {
          'padding': _this.options.padding + "px"
        }, {
          width: _this.options.maxWidth
        });
        _this._leftPadding = _this.options.padding * 2 + _this.options.avatarSize;
        _this._author = _.find(_this.options.users, {
          id: comment.author
        });
        _this._commentIndex = _.findIndex(_this.options.data, comment);
        _this._previousComment = _this._nextComment = _this.options.data[_this._commentIndex - 1];
        _this._nextComment = _this.options.data[_this._commentIndex + 1];
        _this._sameNextAuthor = _this._nextComment && _this._nextComment.author === comment.author ? true : false;
        _this._samePreviousAuthor = _this._previousComment && _this._previousComment.author === comment.author ? true : false;
        if (_this._samePreviousAuthor || _this._sameNextAuthor) {
          _this._group = _this._group + 1;
        }
        _this._messageMargin = _this._sameNextAuthor && align === 'left' ? _this.options.lineHeight * 0.25 : _this.options.lineHeight * 2;
        _this.comment = new Layer({
          parent: _this.commentsScroll.content,
          name: 'comment',
          backgroundColor: null,
          width: Screen.width,
          height: _this._messageSize.height + _this._messageMargin
        });
        if (!_this._samePreviousAuthor) {
          _this.author = new Layer({
            name: 'comment:author',
            html: _this._author.name,
            parent: _this.comment,
            x: align === 'right' ? Align.right(-_this.options.padding) : _this._leftPadding,
            width: _this.comment.width,
            color: _this.options.authorTextColor,
            backgroundColor: null,
            style: {
              'font-weight': 'bold',
              'font-size': '90%',
              'text-align': align
            }
          });
        }
        _this.message = new Layer({
          name: 'comment:message',
          parent: _this.comment,
          html: comment.message,
          height: _this._messageSize.height,
          y: _this.options.lineHeight,
          backgroundColor: _this.options.bubbleColor[align],
          color: _this.options.bubbleText[align],
          borderRadius: _this.options.borderRadius,
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
          if (!_this._sameNextAuthor) {
            _this.avatar = new Layer({
              parent: _this.comment,
              name: 'comment:avatar',
              size: _this.options.avatarSize,
              borderRadius: _this.options.avatarBorderRadius,
              image: "images/" + _this._author.avatar,
              x: _this.options.padding,
              y: Align.bottom(-_this.options.padding * 2)
            });
          }
          if (_this._samePreviousAuthor && _this._sameNextAuthor) {
            _this.message.style = (
              obj = {},
              obj["border-top-" + align + "-radius"] = '3px',
              obj["border-bottom-" + align + "-radius"] = '3px',
              obj
            );
          }
          if (_this._group === 1) {
            _this.message.style = (
              obj1 = {},
              obj1["border-bottom-" + align + "-radius"] = '3px',
              obj1
            );
          }
          if (_this._group > 1 && !_this._sameNextAuthor) {
            _this.message.style = (
              obj2 = {},
              obj2["border-top-" + align + "-radius"] = '3px',
              obj2
            );
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2xpZWJjaGVuL0Ryb3Bib3ggKEZhY2Vib29rKS9QZXJzb25hbC9GcmFtZXIgY2hhdC9tb2R1bGUvZXhhbXBsZS9zYW1wbGVDaGF0LmZyYW1lci9tb2R1bGVzL2lucHV0LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2xpZWJjaGVuL0Ryb3Bib3ggKEZhY2Vib29rKS9QZXJzb25hbC9GcmFtZXIgY2hhdC9tb2R1bGUvZXhhbXBsZS9zYW1wbGVDaGF0LmZyYW1lci9tb2R1bGVzL2NoYXQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzLmtleWJvYXJkTGF5ZXIgPSBuZXcgTGF5ZXJcblx0eDowLCB5OlNjcmVlbi5oZWlnaHQsIHdpZHRoOlNjcmVlbi53aWR0aCwgaGVpZ2h0OjQzMlxuXHRodG1sOlwiPGltZyBzdHlsZT0nd2lkdGg6IDEwMCU7JyBzcmM9J21vZHVsZXMva2V5Ym9hcmQucG5nJy8+XCJcblxuI3NjcmVlbiB3aWR0aCB2cy4gc2l6ZSBvZiBpbWFnZSB3aWR0aFxuZ3Jvd3RoUmF0aW8gPSBTY3JlZW4ud2lkdGggLyA3MzJcbmltYWdlSGVpZ2h0ID0gZ3Jvd3RoUmF0aW8gKiA0MzJcblxuZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcyA9XG5cdHNob3duOiBcblx0XHR5OiBTY3JlZW4uaGVpZ2h0IC0gaW1hZ2VIZWlnaHRcblxuZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0Y3VydmU6IFwic3ByaW5nKDUwMCw1MCwxNSlcIlxuXG5jbGFzcyBleHBvcnRzLklucHV0IGV4dGVuZHMgTGF5ZXJcblx0QGRlZmluZSBcInN0eWxlXCIsXG5cdFx0Z2V0OiAtPiBAaW5wdXQuc3R5bGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdF8uZXh0ZW5kIEBpbnB1dC5zdHlsZSwgdmFsdWVcblxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IEBpbnB1dC52YWx1ZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QGlucHV0LnZhbHVlID0gdmFsdWVcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRvcHRpb25zLnNldHVwID89IGZhbHNlXG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmNsaXAgPz0gZmFsc2Vcblx0XHRvcHRpb25zLmhlaWdodCA/PSA2MFxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IGlmIG9wdGlvbnMuc2V0dXAgdGhlbiBcInJnYmEoMjU1LCA2MCwgNDcsIC41KVwiIGVsc2UgXCJ0cmFuc3BhcmVudFwiXG5cdFx0b3B0aW9ucy5mb250U2l6ZSA/PSAzMFxuXHRcdG9wdGlvbnMubGluZUhlaWdodCA/PSAzMFxuXHRcdG9wdGlvbnMucGFkZGluZyA/PSAxMFxuXHRcdG9wdGlvbnMudGV4dCA/PSBcIlwiXG5cdFx0b3B0aW9ucy5wbGFjZWhvbGRlciA/PSBcIlwiXG5cdFx0b3B0aW9ucy52aXJ0dWFsS2V5Ym9hcmQgPz0gaWYgVXRpbHMuaXNNb2JpbGUoKSB0aGVuIGZhbHNlIGVsc2UgdHJ1ZVxuXHRcdG9wdGlvbnMudHlwZSA/PSBcInRleHRcIlxuXHRcdG9wdGlvbnMuZ29CdXR0b24gPz0gZmFsc2VcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdEBwbGFjZWhvbGRlckNvbG9yID0gb3B0aW9ucy5wbGFjZWhvbGRlckNvbG9yIGlmIG9wdGlvbnMucGxhY2Vob2xkZXJDb2xvcj9cblx0XHRAaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiaW5wdXRcIlxuXHRcdEBpbnB1dC5pZCA9IFwiaW5wdXQtI3tfLm5vdygpfVwiXG5cdFx0QGlucHV0LnN0eWxlLmNzc1RleHQgPSBcImZvbnQtc2l6ZTogI3tvcHRpb25zLmZvbnRTaXplfXB4OyBsaW5lLWhlaWdodDogI3tvcHRpb25zLmxpbmVIZWlnaHR9cHg7IHBhZGRpbmc6ICN7b3B0aW9ucy5wYWRkaW5nfXB4OyB3aWR0aDogI3tvcHRpb25zLndpZHRofXB4OyBoZWlnaHQ6ICN7b3B0aW9ucy5oZWlnaHR9cHg7IGJvcmRlcjogbm9uZTsgb3V0bGluZS13aWR0aDogMDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKGFib3V0OmJsYW5rKTsgYmFja2dyb3VuZC1jb2xvcjogI3tvcHRpb25zLmJhY2tncm91bmRDb2xvcn07XCJcblx0XHRAaW5wdXQudmFsdWUgPSBvcHRpb25zLnRleHRcblx0XHRAaW5wdXQudHlwZSA9IG9wdGlvbnMudHlwZVxuXHRcdEBpbnB1dC5wbGFjZWhvbGRlciA9IG9wdGlvbnMucGxhY2Vob2xkZXJcblx0XHRAZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJmb3JtXCJcblxuXHRcdGlmIG9wdGlvbnMuZ29CdXR0b25cblx0XHRcdEBmb3JtLmFjdGlvbiA9IFwiI1wiXG5cdFx0XHRAZm9ybS5hZGRFdmVudExpc3RlbmVyIFwic3VibWl0XCIsIChldmVudCkgLT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0QGZvcm0uYXBwZW5kQ2hpbGQgQGlucHV0XG5cdFx0QF9lbGVtZW50LmFwcGVuZENoaWxkIEBmb3JtXG5cblx0XHRAYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QHVwZGF0ZVBsYWNlaG9sZGVyQ29sb3Igb3B0aW9ucy5wbGFjZWhvbGRlckNvbG9yIGlmIEBwbGFjZWhvbGRlckNvbG9yXG5cblx0XHQjb25seSBzaG93IGhvbm9yIHZpcnR1YWwga2V5Ym9hcmQgb3B0aW9uIHdoZW4gbm90IG9uIG1vYmlsZSxcblx0XHQjb3RoZXJ3aXNlIGlnbm9yZVxuXHRcdGlmICFVdGlscy5pc01vYmlsZSgpICYmIG9wdGlvbnMudmlydHVhbEtleWJvYXJkIGlzIHRydWVcblx0XHRcdEBpbnB1dC5hZGRFdmVudExpc3RlbmVyIFwiZm9jdXNcIiwgLT5cblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRcdGV4cG9ydHMua2V5Ym9hcmRMYXllci5zdGF0ZXMubmV4dCgpXG5cdFx0XHRAaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciBcImJsdXJcIiwgLT5cblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcy5zd2l0Y2ggXCJkZWZhdWx0XCJcblxuXHR1cGRhdGVQbGFjZWhvbGRlckNvbG9yOiAoY29sb3IpIC0+XG5cdFx0QHBsYWNlaG9sZGVyQ29sb3IgPSBjb2xvclxuXHRcdGlmIEBwYWdlU3R5bGU/XG5cdFx0XHRkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkIEBwYWdlU3R5bGVcblx0XHRAcGFnZVN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInN0eWxlXCJcblx0XHRAcGFnZVN0eWxlLnR5cGUgPSBcInRleHQvY3NzXCJcblx0XHRjc3MgPSBcIiMje0BpbnB1dC5pZH06Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogI3tAcGxhY2Vob2xkZXJDb2xvcn07IH1cIlxuXHRcdEBwYWdlU3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUgY3NzKVxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQgQHBhZ2VTdHlsZVxuXG5cdGZvY3VzOiAoKSAtPlxuXHRcdEBpbnB1dC5mb2N1cygpXG5cblx0b25Gb2N1czogKGNiKSAtPlxuXHRcdEBpbnB1dC5hZGRFdmVudExpc3RlbmVyIFwiZm9jdXNcIiwgLT5cblx0XHRcdGNiLmFwcGx5KEApXG5cblx0b25CbHVyOiAoY2IpIC0+XG5cdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJibHVyXCIsIC0+XG5cdFx0XHRjYi5hcHBseShAKVxuIiwiSW5wdXRNb2R1bGUgPSByZXF1aXJlICdpbnB1dCdcblxuY2xhc3MgZXhwb3J0cy5DaGF0XG5cdGRlZmF1bHRzID1cblx0XHRmb250U2l6ZTogMjRcblx0XHRsaW5lSGVpZ2h0OiAzNlxuXHRcdHBhZGRpbmc6IDIwXG5cdFx0Ym9yZGVyUmFkaXVzOiAyMFxuXHRcdG1heFdpZHRoOiBTY3JlZW4ud2lkdGggKiAwLjZcblx0XHRhdmF0YXJTaXplOiA2MFxuXHRcdGF2YXRhckJvcmRlclJhZGl1czogMzBcblx0XHRpbnB1dEJvcmRlckNvbG9yOiAnI2NjYydcblx0XHRpbnB1dEhlaWdodDogODBcblx0XHRwbGFjZWhvbGRlcjogJ1N0YXJ0IGNoYXR0aW5nJ1xuXHRcdGRlZmF1bHRVc2VySWQ6IDFcblx0XHRhdXRob3JUZXh0Q29sb3I6ICcjOTk5J1xuXHRcdGJ1YmJsZUNvbG9yOlxuXHRcdFx0cmlnaHQ6ICcjNDA4MEZGJ1xuXHRcdFx0bGVmdDogJyNlZWUnXG5cdFx0YnViYmxlVGV4dDpcblx0XHRcdHJpZ2h0OiAnd2hpdGUnXG5cdFx0XHRsZWZ0OiAnYmxhY2snXG5cdFx0ZGF0YTogW1xuXHRcdFx0e1xuXHRcdFx0XHRhdXRob3I6IDFcblx0XHRcdFx0bWVzc2FnZTogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBlaSBoYXMgaW1wZXR1cyB2aXR1cGVyYXRhIGFkdmVyc2FyaXVtLCBuaWhpbCBwb3B1bG8gc2VtcGVyIGV1IGl1cywgYW4gZWFtIHZlcm8gc2Vuc2lidXMuJ1xuXHRcdFx0fVxuXHRcdF1cblx0XHR1c2VyczogW1xuXHRcdFx0e1xuXHRcdFx0XHRpZDogMVxuXHRcdFx0XHRuYW1lOiAnTmluZ3hpYSdcblx0XHRcdFx0YXZhdGFyOiAnbmluZ3hpYS5qcGcnXG5cdFx0XHR9XG5cdFx0XVxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRpZiBvcHRpb25zID09IHVuZGVmaW5lZCB0aGVuIG9wdGlvbnMgPSB7fVxuXHRcdG9wdGlvbnMgPSBfLmRlZmF1bHRzIG9wdGlvbnMsIGRlZmF1bHRzXG5cdFx0QG9wdGlvbnMgPSBvcHRpb25zXG5cdFx0QF9ncm91cCA9IDBcblxuXHRcdEBjb21tZW50c1Njcm9sbCA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdG5hbWU6ICdjb21tZW50cydcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0IC0gQG9wdGlvbnMuaW5wdXRIZWlnaHRcblx0XHRcdG1vdXNlV2hlZWxFbmFibGVkOiB0cnVlXG5cdFx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXG5cdFx0QGNvbW1lbnRzU2Nyb2xsLmNvbnRlbnRJbnNldCA9XG5cdFx0XHR0b3A6IEBvcHRpb25zLnBhZGRpbmdcblxuXHRcdEByZW5kZXJDb21tZW50ID0gKGNvbW1lbnQsIGFsaWduKSA9PlxuXHRcdFx0IyBDYWxjdWF0ZSB0aGUgbWVzc2FnZSBzaXplXG5cdFx0XHRAX21lc3NhZ2VTaXplID0gVXRpbHMudGV4dFNpemUgY29tbWVudC5tZXNzYWdlLFxuXHRcdFx0XHR7J3BhZGRpbmcnOiBcIiN7QG9wdGlvbnMucGFkZGluZ31weFwifSxcblx0XHRcdFx0e3dpZHRoOiBAb3B0aW9ucy5tYXhXaWR0aH1cblxuXHRcdFx0QF9sZWZ0UGFkZGluZyA9IEBvcHRpb25zLnBhZGRpbmcgKiAyICsgQG9wdGlvbnMuYXZhdGFyU2l6ZVxuXG5cdFx0XHQjIEZpbmQgdGhlIGF1dGhvclxuXHRcdFx0QF9hdXRob3IgPSBfLmZpbmQgQG9wdGlvbnMudXNlcnMsIHtpZDogY29tbWVudC5hdXRob3J9XG5cblx0XHRcdCMgRmluZCBjb21tZW50cyBieSB0aGUgc2FtZSBhdXRob3Jcblx0XHRcdCMgT25seSB3b3JrcyBvbiBsZWZ0IGNvbW1lbnRzIHNvIGZhciwgbmVlZCB0byBkbyBmb3IgcmlnaHRcblx0XHRcdEBfY29tbWVudEluZGV4ID0gXy5maW5kSW5kZXggQG9wdGlvbnMuZGF0YSwgY29tbWVudFxuXHRcdFx0XG5cdFx0XHRAX3ByZXZpb3VzQ29tbWVudCA9IEBfbmV4dENvbW1lbnQgPSBAb3B0aW9ucy5kYXRhW0BfY29tbWVudEluZGV4IC0gMV1cblx0XHRcdEBfbmV4dENvbW1lbnQgPSBAb3B0aW9ucy5kYXRhW0BfY29tbWVudEluZGV4ICsgMV1cblxuXHRcdFx0QF9zYW1lTmV4dEF1dGhvciA9IGlmIEBfbmV4dENvbW1lbnQgYW5kIEBfbmV4dENvbW1lbnQuYXV0aG9yIGlzIGNvbW1lbnQuYXV0aG9yIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0XHRAX3NhbWVQcmV2aW91c0F1dGhvciA9IGlmIEBfcHJldmlvdXNDb21tZW50IGFuZCBAX3ByZXZpb3VzQ29tbWVudC5hdXRob3IgaXMgY29tbWVudC5hdXRob3IgdGhlbiB0cnVlIGVsc2UgZmFsc2VcblxuXHRcdFx0aWYgQF9zYW1lUHJldmlvdXNBdXRob3Igb3IgQF9zYW1lTmV4dEF1dGhvclxuXHRcdFx0XHRAX2dyb3VwID0gQF9ncm91cCArIDFcblxuXHRcdFx0QF9tZXNzYWdlTWFyZ2luID0gaWYgQF9zYW1lTmV4dEF1dGhvciBhbmQgYWxpZ24gaXMgJ2xlZnQnIHRoZW4gQG9wdGlvbnMubGluZUhlaWdodCAqIDAuMjUgZWxzZSBAb3B0aW9ucy5saW5lSGVpZ2h0ICogMlxuXG5cdFx0XHQjIENvbnN0cnVjdCB0aGUgY29tbWVudFxuXHRcdFx0QGNvbW1lbnQgPSBuZXcgTGF5ZXJcblx0XHRcdFx0cGFyZW50OiBAY29tbWVudHNTY3JvbGwuY29udGVudFxuXHRcdFx0XHRuYW1lOiAnY29tbWVudCdcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0aGVpZ2h0OiBAX21lc3NhZ2VTaXplLmhlaWdodCArIEBfbWVzc2FnZU1hcmdpblxuXG5cdFx0XHR1bmxlc3MgQF9zYW1lUHJldmlvdXNBdXRob3Jcblx0XHRcdFx0QGF1dGhvciA9IG5ldyBMYXllclxuXHRcdFx0XHRcdG5hbWU6ICdjb21tZW50OmF1dGhvcidcblx0XHRcdFx0XHRodG1sOiBAX2F1dGhvci5uYW1lXG5cdFx0XHRcdFx0cGFyZW50OiBAY29tbWVudFxuXHRcdFx0XHRcdHg6IGlmIGFsaWduIGlzICdyaWdodCcgdGhlbiBBbGlnbi5yaWdodCgtQG9wdGlvbnMucGFkZGluZykgZWxzZSBAX2xlZnRQYWRkaW5nXG5cdFx0XHRcdFx0d2lkdGg6IEBjb21tZW50LndpZHRoXG5cdFx0XHRcdFx0Y29sb3I6IEBvcHRpb25zLmF1dGhvclRleHRDb2xvclxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdFx0J2ZvbnQtd2VpZ2h0JzogJ2JvbGQnXG5cdFx0XHRcdFx0XHQnZm9udC1zaXplJzogJzkwJSdcblx0XHRcdFx0XHRcdCd0ZXh0LWFsaWduJzogYWxpZ25cblxuXHRcdFx0QG1lc3NhZ2UgPSBuZXcgTGF5ZXJcblx0XHRcdFx0bmFtZTogJ2NvbW1lbnQ6bWVzc2FnZSdcblx0XHRcdFx0cGFyZW50OiBAY29tbWVudFxuXHRcdFx0XHRodG1sOiBjb21tZW50Lm1lc3NhZ2Vcblx0XHRcdFx0aGVpZ2h0OiBAX21lc3NhZ2VTaXplLmhlaWdodFxuXHRcdFx0XHR5OiBAb3B0aW9ucy5saW5lSGVpZ2h0XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogQG9wdGlvbnMuYnViYmxlQ29sb3JbYWxpZ25dXG5cdFx0XHRcdGNvbG9yOiBAb3B0aW9ucy5idWJibGVUZXh0W2FsaWduXVxuXHRcdFx0XHRib3JkZXJSYWRpdXM6IEBvcHRpb25zLmJvcmRlclJhZGl1c1xuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHQncGFkZGluZyc6IFwiI3tAb3B0aW9ucy5wYWRkaW5nfXB4XCJcblx0XHRcdFx0XHQnd2lkdGgnOiAnYXV0bydcblx0XHRcdFx0XHQnbWF4LXdpZHRoJzogXCIje0BfbWVzc2FnZVNpemUud2lkdGh9cHhcIlxuXHRcdFx0XHRcdCd0ZXh0LWFsaWduJzogYWxpZ25cblxuXG5cdFx0XHQjIFNwZWNpYWwgc3R1ZmYgZm9yIGFsaWdubWVudFxuXHRcdFx0aWYgYWxpZ24gaXMgJ3JpZ2h0J1xuXHRcdFx0XHRAX3dpZHRoID0gcGFyc2VJbnQgQG1lc3NhZ2UuY29tcHV0ZWRTdHlsZSgpWyd3aWR0aCddXG5cdFx0XHRcdEBtZXNzYWdlLnggPSBTY3JlZW4ud2lkdGggLSBAX3dpZHRoIC0gQG9wdGlvbnMucGFkZGluZ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIEF2YXRhclxuXHRcdFx0XHRALm1lc3NhZ2UueCA9IEBfbGVmdFBhZGRpbmdcblxuXHRcdFx0XHR1bmxlc3MgQF9zYW1lTmV4dEF1dGhvclxuXHRcdFx0XHRcdEBhdmF0YXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRcdHBhcmVudDogQGNvbW1lbnRcblx0XHRcdFx0XHRcdG5hbWU6ICdjb21tZW50OmF2YXRhcidcblx0XHRcdFx0XHRcdHNpemU6IEBvcHRpb25zLmF2YXRhclNpemVcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogQG9wdGlvbnMuYXZhdGFyQm9yZGVyUmFkaXVzXG5cdFx0XHRcdFx0XHRpbWFnZTogXCJpbWFnZXMvI3tAX2F1dGhvci5hdmF0YXJ9XCJcblx0XHRcdFx0XHRcdHg6IEBvcHRpb25zLnBhZGRpbmdcblx0XHRcdFx0XHRcdHk6IEFsaWduLmJvdHRvbSgtQG9wdGlvbnMucGFkZGluZyAqIDIpXG5cblx0XHRcdFx0IyBHcm91cGVkIGNvbW1lbnRzIGJvcmRlclxuXHRcdFx0XHRpZiBAX3NhbWVQcmV2aW91c0F1dGhvciBhbmQgQF9zYW1lTmV4dEF1dGhvclxuXHRcdFx0XHRcdEBtZXNzYWdlLnN0eWxlID1cblx0XHRcdFx0XHRcdFwiYm9yZGVyLXRvcC0je2FsaWdufS1yYWRpdXNcIjogJzNweCdcblx0XHRcdFx0XHRcdFwiYm9yZGVyLWJvdHRvbS0je2FsaWdufS1yYWRpdXNcIjogJzNweCdcblxuXHRcdFx0XHRpZiBAX2dyb3VwIGlzIDFcblx0XHRcdFx0XHRAbWVzc2FnZS5zdHlsZSA9IFwiYm9yZGVyLWJvdHRvbS0je2FsaWdufS1yYWRpdXNcIjogJzNweCdcblxuXHRcdFx0XHRpZiBAX2dyb3VwID4gMSBhbmQgIUBfc2FtZU5leHRBdXRob3Jcblx0XHRcdFx0XHRAbWVzc2FnZS5zdHlsZSA9IFwiYm9yZGVyLXRvcC0je2FsaWdufS1yYWRpdXNcIjogJzNweCdcblxuXHRcdFx0IyBSZWNhbGN1YXRlIHBvc2l0aW9uXG5cdFx0XHRAcmVmbG93KClcblxuXHRcdEByZWZsb3cgPSAoKSA9PlxuXHRcdFx0QGNvbW1lbnRzSGVpZ2h0ID0gMFxuXHRcdFx0QGNvbW1lbnRzID0gQGNvbW1lbnRzU2Nyb2xsLmNvbnRlbnQuY2hpbGRyZW5cblxuXHRcdFx0IyBMb29wIHRocm91Z2ggYWxsIHRoZSBjb21tZW50c1xuXHRcdFx0Zm9yIGNvbW1lbnQsIGkgaW4gQGNvbW1lbnRzXG5cdFx0XHRcdGNvbW1lbnRzSGVpZ2h0ID0gQGNvbW1lbnRzSGVpZ2h0ICsgY29tbWVudC5oZWlnaHRcblx0XHRcdFx0QHlPZmZzZXQgPSAwXG5cblx0XHRcdFx0IyBBZGQgdXAgdGhlIGhlaWdodCBvZiB0aGUgc2libGluZyBsYXllcnMgdG8gdGhlIGxlZnQgb2YgdGhlIGN1cnJlbnQgbGF5ZXJcblx0XHRcdFx0Zm9yIGxheWVyIGluIF8udGFrZShAY29tbWVudHMsIGkpXG5cdFx0XHRcdFx0QHlPZmZzZXQgPSBAeU9mZnNldCArIGxheWVyLmhlaWdodFxuXG5cdFx0XHRcdCMgU2V0IHRoZSBjdXJyZW50IGNvbW1lbnQgcG9zaXRpb24gdG8gdGhlIGhlaWdodCBvZiBsZWZ0IHNpYmxpbmdzXG5cdFx0XHRcdGNvbW1lbnQueSA9IEB5T2Zmc2V0XG5cblx0XHRcdCMgU2Nyb2xsIHN0dWZmXG5cdFx0XHRAY29tbWVudHNTY3JvbGwudXBkYXRlQ29udGVudCgpXG5cdFx0XHRAY29tbWVudHNTY3JvbGwuc2Nyb2xsVG9MYXllciBAY29tbWVudHNbQGNvbW1lbnRzLmxlbmd0aCAtIDFdXG5cblxuXHRcdCMgRHJhdyBldmVyeXRoaW5nXG5cdFx0Xy5tYXAgQG9wdGlvbnMuZGF0YSwgKGNvbW1lbnQpID0+XG5cdFx0XHRAcmVuZGVyQ29tbWVudChjb21tZW50LCAnbGVmdCcpXG5cblxuXHRcdCMgTmV3IGNvbW1wZW50c1xuXHRcdEBpbnB1dFdyYXBwZXIgPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6ICdpbnB1dCdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0aGVpZ2h0OiBAb3B0aW9ucy5pbnB1dEhlaWdodFxuXHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0eTogQWxpZ24uYm90dG9tXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0J2JvcmRlci10b3AnOiBcIjFweCBzb2xpZCAje0BvcHRpb25zLmlucHV0Qm9yZGVyQ29sb3J9XCJcblxuXHRcdEBpbnB1dCA9IG5ldyBJbnB1dE1vZHVsZS5JbnB1dFxuXHRcdFx0bmFtZTogJ2lucHV0OmZpZWxkJ1xuXHRcdFx0cGFyZW50OiBAaW5wdXRXcmFwcGVyXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRwbGFjZWhvbGRlcjogQG9wdGlvbnMucGxhY2Vob2xkZXJcblx0XHRcdHZpcnR1YWxLZXlib2FyZDogZmFsc2VcblxuXHRcdGNyZWF0ZUNvbW1lbnQgPSAodmFsdWUpID0+XG5cdFx0XHRuZXdDb21tZW50ID1cblx0XHRcdFx0YXV0aG9yOiBAb3B0aW9ucy5kZWZhdWx0VXNlcklkXG5cdFx0XHRcdG1lc3NhZ2U6IHZhbHVlXG5cblx0XHRcdEByZW5kZXJDb21tZW50IG5ld0NvbW1lbnQsICdyaWdodCdcblxuXHRcdEBpbnB1dC5vbiAna2V5dXAnLCAoZXZlbnQpIC0+XG5cdFx0XHQjIEFkZCBuZXcgY29tbWVudHNcblx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDEzXG5cdFx0XHRcdGNyZWF0ZUNvbW1lbnQoQHZhbHVlKVxuXHRcdFx0XHRAdmFsdWUgPSAnJ1xuXG5cdFx0QGlucHV0LmZvcm0uYWRkRXZlbnRMaXN0ZW5lciAnc3VibWl0JywgKGV2ZW50KSAtPlxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURBQSxJQUFBOztBQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsT0FBUjs7QUFFUixPQUFPLENBQUM7QUFDYixNQUFBOztFQUFBLFFBQUEsR0FDQztJQUFBLFFBQUEsRUFBVSxFQUFWO0lBQ0EsVUFBQSxFQUFZLEVBRFo7SUFFQSxPQUFBLEVBQVMsRUFGVDtJQUdBLFlBQUEsRUFBYyxFQUhkO0lBSUEsUUFBQSxFQUFVLE1BQU0sQ0FBQyxLQUFQLEdBQWUsR0FKekI7SUFLQSxVQUFBLEVBQVksRUFMWjtJQU1BLGtCQUFBLEVBQW9CLEVBTnBCO0lBT0EsZ0JBQUEsRUFBa0IsTUFQbEI7SUFRQSxXQUFBLEVBQWEsRUFSYjtJQVNBLFdBQUEsRUFBYSxnQkFUYjtJQVVBLGFBQUEsRUFBZSxDQVZmO0lBV0EsZUFBQSxFQUFpQixNQVhqQjtJQVlBLFdBQUEsRUFDQztNQUFBLEtBQUEsRUFBTyxTQUFQO01BQ0EsSUFBQSxFQUFNLE1BRE47S0FiRDtJQWVBLFVBQUEsRUFD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
