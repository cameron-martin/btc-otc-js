// Generated by CoffeeScript 1.6.2
(function() {
  var OTC, OTC_BACKEND, OTC_UI,
    __slice = [].slice;

  OTC_UI = {
    renderSection: {
      loginBox: function() {
        $("#login-box").dialog({
          modal: true,
          autoOpen: true,
          dialogClass: 'no-close',
          closeOnEscape: false,
          draggable: false
        });
        $('#login-submit').button();
        return $('#login-form').submit(function(event) {
          event.preventDefault();
          return OTC.login($('#login-username').val(), $('#login-password').val());
        });
      },
      mainTabs: function() {
        return $('#main-tabs').tabs();
      }
    },
    render: function() {
      var section, sections, _i, _len, _results;

      sections = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = sections.length; _i < _len; _i++) {
        section = sections[_i];
        _results.push(OTC_UI.renderSection[section]());
      }
      return _results;
    },
    updateContent: {
      exchangeRates: function(data) {
        var prop, val, _results;

        _results = [];
        for (prop in data) {
          val = data[prop];
          _results.push($('#exr-' + prop).text(val));
        }
        return _results;
      },
      username: function(data) {
        return $('#display-username').text(data);
      }
    },
    events: {
      load: function() {
        OTC_UI.render('loginBox', 'mainTabs');
        OTC.events.bind('data.exchangeRates', OTC_UI.updateContent.exchangeRates);
        OTC.requestData('exchangeRates');
        return OTC.events.bind('login', function(data) {
          if (!data.success) {
            return console.log('login failed');
          } else {
            $('#login-box').dialog('close');
            return OTC_UI.updateContent.username(OTC.username);
          }
        });
      }
    }
  };

  OTC = {
    loggedIn: false,
    websocket: null,
    username: null,
    /*
    Events management
    List of events that you can bind to:
    login: Fired when the server successfully logs
    data.*: Fired when data is received from the backend.
    */

    _events: {},
    events: {
      bind: function(event, f) {
        OTC._events[event] = OTC._events[event] || [];
        return OTC._events[event].push(f);
      },
      trigger: function(event, info) {
        var f, _i, _len, _ref, _results;

        if (!OTC._events[event]) {
          console.log("Unbound event: " + event);
          return;
        }
        _ref = OTC._events[event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          f = _ref[_i];
          _results.push(f(info));
        }
        return _results;
      }
    },
    requestData: function(name) {
      if (OTC_BACKEND[name]) {
        return OTC.events.trigger("data." + name, OTC_BACKEND[name]);
      }
    },
    login: function(username, password) {
      if (!OTC.loggedIn) {
        OTC.username = username;
        return OTC.events.trigger('login', {
          success: true
        });
      }
    }
  };

  OTC_BACKEND = {
    exchangeRates: {
      ask: 88.76000,
      bid: 87.18166,
      spread: 1.57834
    }
  };

  $(OTC_UI.events.load);

}).call(this);
