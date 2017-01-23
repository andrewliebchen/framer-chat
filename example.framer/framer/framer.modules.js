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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2xpZWJjaGVuL0Ryb3Bib3ggKEZhY2Vib29rKS9QZXJzb25hbC9GcmFtZXIgY2hhdC9tb2R1bGUvZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9pbnB1dC5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9saWViY2hlbi9Ecm9wYm94IChGYWNlYm9vaykvUGVyc29uYWwvRnJhbWVyIGNoYXQvbW9kdWxlL2V4YW1wbGUuZnJhbWVyL21vZHVsZXMvY2hhdC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMua2V5Ym9hcmRMYXllciA9IG5ldyBMYXllclxuXHR4OjAsIHk6U2NyZWVuLmhlaWdodCwgd2lkdGg6U2NyZWVuLndpZHRoLCBoZWlnaHQ6NDMyXG5cdGh0bWw6XCI8aW1nIHN0eWxlPSd3aWR0aDogMTAwJTsnIHNyYz0nbW9kdWxlcy9rZXlib2FyZC5wbmcnLz5cIlxuXG4jc2NyZWVuIHdpZHRoIHZzLiBzaXplIG9mIGltYWdlIHdpZHRoXG5ncm93dGhSYXRpbyA9IFNjcmVlbi53aWR0aCAvIDczMlxuaW1hZ2VIZWlnaHQgPSBncm93dGhSYXRpbyAqIDQzMlxuXG5leHBvcnRzLmtleWJvYXJkTGF5ZXIuc3RhdGVzID1cblx0c2hvd246IFxuXHRcdHk6IFNjcmVlbi5oZWlnaHQgLSBpbWFnZUhlaWdodFxuXG5leHBvcnRzLmtleWJvYXJkTGF5ZXIuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRjdXJ2ZTogXCJzcHJpbmcoNTAwLDUwLDE1KVwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXQgZXh0ZW5kcyBMYXllclxuXHRAZGVmaW5lIFwic3R5bGVcIixcblx0XHRnZXQ6IC0+IEBpbnB1dC5zdHlsZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0Xy5leHRlbmQgQGlucHV0LnN0eWxlLCB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJ2YWx1ZVwiLFxuXHRcdGdldDogLT4gQGlucHV0LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAaW5wdXQudmFsdWUgPSB2YWx1ZVxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdG9wdGlvbnMuc2V0dXAgPz0gZmFsc2Vcblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuY2xpcCA/PSBmYWxzZVxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IDYwXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gaWYgb3B0aW9ucy5zZXR1cCB0aGVuIFwicmdiYSgyNTUsIDYwLCA0NywgLjUpXCIgZWxzZSBcInRyYW5zcGFyZW50XCJcblx0XHRvcHRpb25zLmZvbnRTaXplID89IDMwXG5cdFx0b3B0aW9ucy5saW5lSGVpZ2h0ID89IDMwXG5cdFx0b3B0aW9ucy5wYWRkaW5nID89IDEwXG5cdFx0b3B0aW9ucy50ZXh0ID89IFwiXCJcblx0XHRvcHRpb25zLnBsYWNlaG9sZGVyID89IFwiXCJcblx0XHRvcHRpb25zLnZpcnR1YWxLZXlib2FyZCA/PSBpZiBVdGlscy5pc01vYmlsZSgpIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cdFx0b3B0aW9ucy50eXBlID89IFwidGV4dFwiXG5cdFx0b3B0aW9ucy5nb0J1dHRvbiA/PSBmYWxzZVxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0QHBsYWNlaG9sZGVyQ29sb3IgPSBvcHRpb25zLnBsYWNlaG9sZGVyQ29sb3IgaWYgb3B0aW9ucy5wbGFjZWhvbGRlckNvbG9yP1xuXHRcdEBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJpbnB1dFwiXG5cdFx0QGlucHV0LmlkID0gXCJpbnB1dC0je18ubm93KCl9XCJcblx0XHRAaW5wdXQuc3R5bGUuY3NzVGV4dCA9IFwiZm9udC1zaXplOiAje29wdGlvbnMuZm9udFNpemV9cHg7IGxpbmUtaGVpZ2h0OiAje29wdGlvbnMubGluZUhlaWdodH1weDsgcGFkZGluZzogI3tvcHRpb25zLnBhZGRpbmd9cHg7IHdpZHRoOiAje29wdGlvbnMud2lkdGh9cHg7IGhlaWdodDogI3tvcHRpb25zLmhlaWdodH1weDsgYm9yZGVyOiBub25lOyBvdXRsaW5lLXdpZHRoOiAwOyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoYWJvdXQ6YmxhbmspOyBiYWNrZ3JvdW5kLWNvbG9yOiAje29wdGlvbnMuYmFja2dyb3VuZENvbG9yfTtcIlxuXHRcdEBpbnB1dC52YWx1ZSA9IG9wdGlvbnMudGV4dFxuXHRcdEBpbnB1dC50eXBlID0gb3B0aW9ucy50eXBlXG5cdFx0QGlucHV0LnBsYWNlaG9sZGVyID0gb3B0aW9ucy5wbGFjZWhvbGRlclxuXHRcdEBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImZvcm1cIlxuXG5cdFx0aWYgb3B0aW9ucy5nb0J1dHRvblxuXHRcdFx0QGZvcm0uYWN0aW9uID0gXCIjXCJcblx0XHRcdEBmb3JtLmFkZEV2ZW50TGlzdGVuZXIgXCJzdWJtaXRcIiwgKGV2ZW50KSAtPlxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRAZm9ybS5hcHBlbmRDaGlsZCBAaW5wdXRcblx0XHRAX2VsZW1lbnQuYXBwZW5kQ2hpbGQgQGZvcm1cblxuXHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRAdXBkYXRlUGxhY2Vob2xkZXJDb2xvciBvcHRpb25zLnBsYWNlaG9sZGVyQ29sb3IgaWYgQHBsYWNlaG9sZGVyQ29sb3JcblxuXHRcdCNvbmx5IHNob3cgaG9ub3IgdmlydHVhbCBrZXlib2FyZCBvcHRpb24gd2hlbiBub3Qgb24gbW9iaWxlLFxuXHRcdCNvdGhlcndpc2UgaWdub3JlXG5cdFx0aWYgIVV0aWxzLmlzTW9iaWxlKCkgJiYgb3B0aW9ucy52aXJ0dWFsS2V5Ym9hcmQgaXMgdHJ1ZVxuXHRcdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJmb2N1c1wiLCAtPlxuXHRcdFx0XHRleHBvcnRzLmtleWJvYXJkTGF5ZXIuYnJpbmdUb0Zyb250KClcblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcy5uZXh0KClcblx0XHRcdEBpbnB1dC5hZGRFdmVudExpc3RlbmVyIFwiYmx1clwiLCAtPlxuXHRcdFx0XHRleHBvcnRzLmtleWJvYXJkTGF5ZXIuc3RhdGVzLnN3aXRjaCBcImRlZmF1bHRcIlxuXG5cdHVwZGF0ZVBsYWNlaG9sZGVyQ29sb3I6IChjb2xvcikgLT5cblx0XHRAcGxhY2Vob2xkZXJDb2xvciA9IGNvbG9yXG5cdFx0aWYgQHBhZ2VTdHlsZT9cblx0XHRcdGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQgQHBhZ2VTdHlsZVxuXHRcdEBwYWdlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwic3R5bGVcIlxuXHRcdEBwYWdlU3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIlxuXHRcdGNzcyA9IFwiIyN7QGlucHV0LmlkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAje0BwbGFjZWhvbGRlckNvbG9yfTsgfVwiXG5cdFx0QHBhZ2VTdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSBjc3MpXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCBAcGFnZVN0eWxlXG5cblx0Zm9jdXM6ICgpIC0+XG5cdFx0QGlucHV0LmZvY3VzKClcblxuXHRvbkZvY3VzOiAoY2IpIC0+XG5cdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJmb2N1c1wiLCAtPlxuXHRcdFx0Y2IuYXBwbHkoQClcblxuXHRvbkJsdXI6IChjYikgLT5cblx0XHRAaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciBcImJsdXJcIiwgLT5cblx0XHRcdGNiLmFwcGx5KEApXG4iLCJJbnB1dE1vZHVsZSA9IHJlcXVpcmUgJ2lucHV0J1xuXG5jbGFzcyBleHBvcnRzLkNoYXRcblx0ZGVmYXVsdHMgPVxuXHRcdGZvbnRTaXplOiAyNFxuXHRcdGxpbmVIZWlnaHQ6IDM2XG5cdFx0cGFkZGluZzogMjBcblx0XHRib3JkZXJSYWRpdXM6IDIwXG5cdFx0bWF4V2lkdGg6IFNjcmVlbi53aWR0aCAqIDAuNlxuXHRcdGF2YXRhclNpemU6IDYwXG5cdFx0YXZhdGFyQm9yZGVyUmFkaXVzOiAzMFxuXHRcdGlucHV0Qm9yZGVyQ29sb3I6ICcjY2NjJ1xuXHRcdGlucHV0SGVpZ2h0OiA4MFxuXHRcdHBsYWNlaG9sZGVyOiAnU3RhcnQgY2hhdHRpbmcnXG5cdFx0ZGVmYXVsdFVzZXJJZDogMVxuXHRcdGF1dGhvclRleHRDb2xvcjogJyM5OTknXG5cdFx0YnViYmxlQ29sb3I6XG5cdFx0XHRyaWdodDogJyM0MDgwRkYnXG5cdFx0XHRsZWZ0OiAnI2VlZSdcblx0XHRidWJibGVUZXh0OlxuXHRcdFx0cmlnaHQ6ICd3aGl0ZSdcblx0XHRcdGxlZnQ6ICdibGFjaydcblx0XHRkYXRhOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGF1dGhvcjogMVxuXHRcdFx0XHRtZXNzYWdlOiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGVpIGhhcyBpbXBldHVzIHZpdHVwZXJhdGEgYWR2ZXJzYXJpdW0sIG5paGlsIHBvcHVsbyBzZW1wZXIgZXUgaXVzLCBhbiBlYW0gdmVybyBzZW5zaWJ1cy4nXG5cdFx0XHR9XG5cdFx0XVxuXHRcdHVzZXJzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiAxXG5cdFx0XHRcdG5hbWU6ICdOaW5neGlhJ1xuXHRcdFx0XHRhdmF0YXI6ICduaW5neGlhLmpwZydcblx0XHRcdH1cblx0XHRdXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcdGlmIG9wdGlvbnMgPT0gdW5kZWZpbmVkIHRoZW4gb3B0aW9ucyA9IHt9XG5cdFx0b3B0aW9ucyA9IF8uZGVmYXVsdHMgb3B0aW9ucywgZGVmYXVsdHNcblx0XHRAb3B0aW9ucyA9IG9wdGlvbnNcblx0XHRAX2dyb3VwID0gMFxuXG5cdFx0QGNvbW1lbnRzU2Nyb2xsID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0bmFtZTogJ2NvbW1lbnRzJ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHQgLSBAb3B0aW9ucy5pbnB1dEhlaWdodFxuXHRcdFx0bW91c2VXaGVlbEVuYWJsZWQ6IHRydWVcblx0XHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG5cblx0XHRAY29tbWVudHNTY3JvbGwuY29udGVudEluc2V0ID1cblx0XHRcdHRvcDogQG9wdGlvbnMucGFkZGluZ1xuXG5cdFx0QHJlbmRlckNvbW1lbnQgPSAoY29tbWVudCwgYWxpZ24pID0+XG5cdFx0XHQjIENhbGN1YXRlIHRoZSBtZXNzYWdlIHNpemVcblx0XHRcdEBfbWVzc2FnZVNpemUgPSBVdGlscy50ZXh0U2l6ZSBjb21tZW50Lm1lc3NhZ2UsXG5cdFx0XHRcdHsncGFkZGluZyc6IFwiI3tAb3B0aW9ucy5wYWRkaW5nfXB4XCJ9LFxuXHRcdFx0XHR7d2lkdGg6IEBvcHRpb25zLm1heFdpZHRofVxuXG5cdFx0XHRAX2xlZnRQYWRkaW5nID0gQG9wdGlvbnMucGFkZGluZyAqIDIgKyBAb3B0aW9ucy5hdmF0YXJTaXplXG5cblx0XHRcdCMgRmluZCB0aGUgYXV0aG9yXG5cdFx0XHRAX2F1dGhvciA9IF8uZmluZCBAb3B0aW9ucy51c2Vycywge2lkOiBjb21tZW50LmF1dGhvcn1cblxuXHRcdFx0IyBGaW5kIGNvbW1lbnRzIGJ5IHRoZSBzYW1lIGF1dGhvclxuXHRcdFx0IyBPbmx5IHdvcmtzIG9uIGxlZnQgY29tbWVudHMgc28gZmFyLCBuZWVkIHRvIGRvIGZvciByaWdodFxuXHRcdFx0QF9jb21tZW50SW5kZXggPSBfLmZpbmRJbmRleCBAb3B0aW9ucy5kYXRhLCBjb21tZW50XG5cdFx0XHRcblx0XHRcdEBfcHJldmlvdXNDb21tZW50ID0gQF9uZXh0Q29tbWVudCA9IEBvcHRpb25zLmRhdGFbQF9jb21tZW50SW5kZXggLSAxXVxuXHRcdFx0QF9uZXh0Q29tbWVudCA9IEBvcHRpb25zLmRhdGFbQF9jb21tZW50SW5kZXggKyAxXVxuXG5cdFx0XHRAX3NhbWVOZXh0QXV0aG9yID0gaWYgQF9uZXh0Q29tbWVudCBhbmQgQF9uZXh0Q29tbWVudC5hdXRob3IgaXMgY29tbWVudC5hdXRob3IgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRcdEBfc2FtZVByZXZpb3VzQXV0aG9yID0gaWYgQF9wcmV2aW91c0NvbW1lbnQgYW5kIEBfcHJldmlvdXNDb21tZW50LmF1dGhvciBpcyBjb21tZW50LmF1dGhvciB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXG5cdFx0XHRpZiBAX3NhbWVQcmV2aW91c0F1dGhvciBvciBAX3NhbWVOZXh0QXV0aG9yXG5cdFx0XHRcdEBfZ3JvdXAgPSBAX2dyb3VwICsgMVxuXG5cdFx0XHRAX21lc3NhZ2VNYXJnaW4gPSBpZiBAX3NhbWVOZXh0QXV0aG9yIGFuZCBhbGlnbiBpcyAnbGVmdCcgdGhlbiBAb3B0aW9ucy5saW5lSGVpZ2h0ICogMC4yNSBlbHNlIEBvcHRpb25zLmxpbmVIZWlnaHQgKiAyXG5cblx0XHRcdCMgQ29uc3RydWN0IHRoZSBjb21tZW50XG5cdFx0XHRAY29tbWVudCA9IG5ldyBMYXllclxuXHRcdFx0XHRwYXJlbnQ6IEBjb21tZW50c1Njcm9sbC5jb250ZW50XG5cdFx0XHRcdG5hbWU6ICdjb21tZW50J1xuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IEBfbWVzc2FnZVNpemUuaGVpZ2h0ICsgQF9tZXNzYWdlTWFyZ2luXG5cblx0XHRcdHVubGVzcyBAX3NhbWVQcmV2aW91c0F1dGhvclxuXHRcdFx0XHRAYXV0aG9yID0gbmV3IExheWVyXG5cdFx0XHRcdFx0bmFtZTogJ2NvbW1lbnQ6YXV0aG9yJ1xuXHRcdFx0XHRcdGh0bWw6IEBfYXV0aG9yLm5hbWVcblx0XHRcdFx0XHRwYXJlbnQ6IEBjb21tZW50XG5cdFx0XHRcdFx0eDogaWYgYWxpZ24gaXMgJ3JpZ2h0JyB0aGVuIEFsaWduLnJpZ2h0KC1Ab3B0aW9ucy5wYWRkaW5nKSBlbHNlIEBfbGVmdFBhZGRpbmdcblx0XHRcdFx0XHR3aWR0aDogQGNvbW1lbnQud2lkdGhcblx0XHRcdFx0XHRjb2xvcjogQG9wdGlvbnMuYXV0aG9yVGV4dENvbG9yXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0XHQnZm9udC13ZWlnaHQnOiAnYm9sZCdcblx0XHRcdFx0XHRcdCdmb250LXNpemUnOiAnOTAlJ1xuXHRcdFx0XHRcdFx0J3RleHQtYWxpZ24nOiBhbGlnblxuXG5cdFx0XHRAbWVzc2FnZSA9IG5ldyBMYXllclxuXHRcdFx0XHRuYW1lOiAnY29tbWVudDptZXNzYWdlJ1xuXHRcdFx0XHRwYXJlbnQ6IEBjb21tZW50XG5cdFx0XHRcdGh0bWw6IGNvbW1lbnQubWVzc2FnZVxuXHRcdFx0XHRoZWlnaHQ6IEBfbWVzc2FnZVNpemUuaGVpZ2h0XG5cdFx0XHRcdHk6IEBvcHRpb25zLmxpbmVIZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBAb3B0aW9ucy5idWJibGVDb2xvclthbGlnbl1cblx0XHRcdFx0Y29sb3I6IEBvcHRpb25zLmJ1YmJsZVRleHRbYWxpZ25dXG5cdFx0XHRcdGJvcmRlclJhZGl1czogQG9wdGlvbnMuYm9yZGVyUmFkaXVzXG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdCdwYWRkaW5nJzogXCIje0BvcHRpb25zLnBhZGRpbmd9cHhcIlxuXHRcdFx0XHRcdCd3aWR0aCc6ICdhdXRvJ1xuXHRcdFx0XHRcdCdtYXgtd2lkdGgnOiBcIiN7QF9tZXNzYWdlU2l6ZS53aWR0aH1weFwiXG5cdFx0XHRcdFx0J3RleHQtYWxpZ24nOiBhbGlnblxuXG5cblx0XHRcdCMgU3BlY2lhbCBzdHVmZiBmb3IgYWxpZ25tZW50XG5cdFx0XHRpZiBhbGlnbiBpcyAncmlnaHQnXG5cdFx0XHRcdEBfd2lkdGggPSBwYXJzZUludCBAbWVzc2FnZS5jb21wdXRlZFN0eWxlKClbJ3dpZHRoJ11cblx0XHRcdFx0QG1lc3NhZ2UueCA9IFNjcmVlbi53aWR0aCAtIEBfd2lkdGggLSBAb3B0aW9ucy5wYWRkaW5nXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMgQXZhdGFyXG5cdFx0XHRcdEAubWVzc2FnZS54ID0gQF9sZWZ0UGFkZGluZ1xuXG5cdFx0XHRcdHVubGVzcyBAX3NhbWVOZXh0QXV0aG9yXG5cdFx0XHRcdFx0QGF2YXRhciA9IG5ldyBMYXllclxuXHRcdFx0XHRcdFx0cGFyZW50OiBAY29tbWVudFxuXHRcdFx0XHRcdFx0bmFtZTogJ2NvbW1lbnQ6YXZhdGFyJ1xuXHRcdFx0XHRcdFx0c2l6ZTogQG9wdGlvbnMuYXZhdGFyU2l6ZVxuXHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBAb3B0aW9ucy5hdmF0YXJCb3JkZXJSYWRpdXNcblx0XHRcdFx0XHRcdGltYWdlOiBcImltYWdlcy8je0BfYXV0aG9yLmF2YXRhcn1cIlxuXHRcdFx0XHRcdFx0eDogQG9wdGlvbnMucGFkZGluZ1xuXHRcdFx0XHRcdFx0eTogQWxpZ24uYm90dG9tKC1Ab3B0aW9ucy5wYWRkaW5nICogMilcblxuXHRcdFx0XHQjIEdyb3VwZWQgY29tbWVudHMgYm9yZGVyXG5cdFx0XHRcdGlmIEBfc2FtZVByZXZpb3VzQXV0aG9yIGFuZCBAX3NhbWVOZXh0QXV0aG9yXG5cdFx0XHRcdFx0QG1lc3NhZ2Uuc3R5bGUgPVxuXHRcdFx0XHRcdFx0XCJib3JkZXItdG9wLSN7YWxpZ259LXJhZGl1c1wiOiAnM3B4J1xuXHRcdFx0XHRcdFx0XCJib3JkZXItYm90dG9tLSN7YWxpZ259LXJhZGl1c1wiOiAnM3B4J1xuXG5cdFx0XHRcdGlmIEBfZ3JvdXAgaXMgMVxuXHRcdFx0XHRcdEBtZXNzYWdlLnN0eWxlID0gXCJib3JkZXItYm90dG9tLSN7YWxpZ259LXJhZGl1c1wiOiAnM3B4J1xuXG5cdFx0XHRcdGlmIEBfZ3JvdXAgPiAxIGFuZCAhQF9zYW1lTmV4dEF1dGhvclxuXHRcdFx0XHRcdEBtZXNzYWdlLnN0eWxlID0gXCJib3JkZXItdG9wLSN7YWxpZ259LXJhZGl1c1wiOiAnM3B4J1xuXG5cdFx0XHQjIFJlY2FsY3VhdGUgcG9zaXRpb25cblx0XHRcdEByZWZsb3coKVxuXG5cdFx0QHJlZmxvdyA9ICgpID0+XG5cdFx0XHRAY29tbWVudHNIZWlnaHQgPSAwXG5cdFx0XHRAY29tbWVudHMgPSBAY29tbWVudHNTY3JvbGwuY29udGVudC5jaGlsZHJlblxuXG5cdFx0XHQjIExvb3AgdGhyb3VnaCBhbGwgdGhlIGNvbW1lbnRzXG5cdFx0XHRmb3IgY29tbWVudCwgaSBpbiBAY29tbWVudHNcblx0XHRcdFx0Y29tbWVudHNIZWlnaHQgPSBAY29tbWVudHNIZWlnaHQgKyBjb21tZW50LmhlaWdodFxuXHRcdFx0XHRAeU9mZnNldCA9IDBcblxuXHRcdFx0XHQjIEFkZCB1cCB0aGUgaGVpZ2h0IG9mIHRoZSBzaWJsaW5nIGxheWVycyB0byB0aGUgbGVmdCBvZiB0aGUgY3VycmVudCBsYXllclxuXHRcdFx0XHRmb3IgbGF5ZXIgaW4gXy50YWtlKEBjb21tZW50cywgaSlcblx0XHRcdFx0XHRAeU9mZnNldCA9IEB5T2Zmc2V0ICsgbGF5ZXIuaGVpZ2h0XG5cblx0XHRcdFx0IyBTZXQgdGhlIGN1cnJlbnQgY29tbWVudCBwb3NpdGlvbiB0byB0aGUgaGVpZ2h0IG9mIGxlZnQgc2libGluZ3Ncblx0XHRcdFx0Y29tbWVudC55ID0gQHlPZmZzZXRcblxuXHRcdFx0IyBTY3JvbGwgc3R1ZmZcblx0XHRcdEBjb21tZW50c1Njcm9sbC51cGRhdGVDb250ZW50KClcblx0XHRcdEBjb21tZW50c1Njcm9sbC5zY3JvbGxUb0xheWVyIEBjb21tZW50c1tAY29tbWVudHMubGVuZ3RoIC0gMV1cblxuXG5cdFx0IyBEcmF3IGV2ZXJ5dGhpbmdcblx0XHRfLm1hcCBAb3B0aW9ucy5kYXRhLCAoY29tbWVudCkgPT5cblx0XHRcdEByZW5kZXJDb21tZW50KGNvbW1lbnQsICdsZWZ0JylcblxuXG5cdFx0IyBOZXcgY29tbXBlbnRzXG5cdFx0QGlucHV0V3JhcHBlciA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJ2lucHV0J1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHRoZWlnaHQ6IEBvcHRpb25zLmlucHV0SGVpZ2h0XG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHR5OiBBbGlnbi5ib3R0b21cblx0XHRcdHN0eWxlOlxuXHRcdFx0XHQnYm9yZGVyLXRvcCc6IFwiMXB4IHNvbGlkICN7QG9wdGlvbnMuaW5wdXRCb3JkZXJDb2xvcn1cIlxuXG5cdFx0QGlucHV0ID0gbmV3IElucHV0TW9kdWxlLklucHV0XG5cdFx0XHRuYW1lOiAnaW5wdXQ6ZmllbGQnXG5cdFx0XHRwYXJlbnQ6IEBpbnB1dFdyYXBwZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdHBsYWNlaG9sZGVyOiBAb3B0aW9ucy5wbGFjZWhvbGRlclxuXHRcdFx0dmlydHVhbEtleWJvYXJkOiBmYWxzZVxuXG5cdFx0Y3JlYXRlQ29tbWVudCA9ICh2YWx1ZSkgPT5cblx0XHRcdG5ld0NvbW1lbnQgPVxuXHRcdFx0XHRhdXRob3I6IEBvcHRpb25zLmRlZmF1bHRVc2VySWRcblx0XHRcdFx0bWVzc2FnZTogdmFsdWVcblxuXHRcdFx0QHJlbmRlckNvbW1lbnQgbmV3Q29tbWVudCwgJ3JpZ2h0J1xuXG5cdFx0QGlucHV0Lm9uICdrZXl1cCcsIChldmVudCkgLT5cblx0XHRcdCMgQWRkIG5ldyBjb21tZW50c1xuXHRcdFx0aWYgZXZlbnQud2hpY2ggaXMgMTNcblx0XHRcdFx0Y3JlYXRlQ29tbWVudChAdmFsdWUpXG5cdFx0XHRcdEB2YWx1ZSA9ICcnXG5cblx0XHRAaW5wdXQuZm9ybS5hZGRFdmVudExpc3RlbmVyICdzdWJtaXQnLCAoZXZlbnQpIC0+XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUVBQTtBREFBLElBQUE7O0FBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxPQUFSOztBQUVSLE9BQU8sQ0FBQztBQUNiLE1BQUE7O0VBQUEsUUFBQSxHQUNDO0lBQUEsUUFBQSxFQUFVLEVBQVY7SUFDQSxVQUFBLEVBQVksRUFEWjtJQUVBLE9BQUEsRUFBUyxFQUZUO0lBR0EsWUFBQSxFQUFjLEVBSGQ7SUFJQSxRQUFBLEVBQVUsTUFBTSxDQUFDLEtBQVAsR0FBZSxHQUp6QjtJQUtBLFVBQUEsRUFBWSxFQUxaO0lBTUEsa0JBQUEsRUFBb0IsRUFOcEI7SUFPQSxnQkFBQSxFQUFrQixNQVBsQjtJQVFBLFdBQUEsRUFBYSxFQVJiO0lBU0EsV0FBQSxFQUFhLGdCQVRiO0lBVUEsYUFBQSxFQUFlLENBVmY7SUFXQSxlQUFBLEVBQWlCLE1BWGpCO0lBWUEsV0FBQSxFQUNDO01BQUEsS0FBQSxFQUFPLFNBQVA7TUFDQSxJQUFBLEVBQU0sTUFETjtLQWJEO0lBZUEsVUFBQSxFQUNDO01BQUEsS0FBQSxFQUFPLE9BQVA7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
