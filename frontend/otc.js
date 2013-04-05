/* 
* Handles rendering and attaching event handlers to the UI elements.
* This is effectively the 'controller' (and partially the view).
* Only UI-related state should be held here.
* Dependencies: OTC
*/

OTC_UI = {
  
  /* The functions which render the static sections */
  renderSection: {
    loginBox: function() {
      $("#login-box").dialog({
        modal: true,
        autoOpen: true,
        dialogClass: 'no-close',
        closeOnEscape: false,
        draggable: false,
      });
      $('#login-submit').button();
      $('#login-form').submit(function(event) {
        event.preventDefault();
        OTC.login($('#login-username').val(), $('#login-password').val(), function() {
          /* Login success */
          OTC_UI.events.afterLogin();
        }, function(message) {
          /* Login failure */
          
        });
      });
    },
    mainTabs: function() {
      $('#main-tabs').tabs();
    },
  },
  
  render: function(sections) {
    if(!Array.isArray(sections)) {
      sections = [sections];
    }
    sections.forEach(function(section) {
      OTC_UI.renderSection[section]();
    });
  },
  
  /* Functions which load/update the dynamic content */
  updateContent: {
    exchangeRates: function() {
      ['ask', 'bid', 'spread'].forEach(function(prop) {
        $('#exr-'+prop).text(OTC_BACKEND.exchangeRates[prop]);
      });
    },
    username: function() {
      $('#display-username').text(OTC.username);
    }
  },
  
  update: function(items) {
    if(!Array.isArray(items)) {
      items = [items];
    }
   items.forEach(function(item) {
      OTC_UI.updateContent[item]();
    });
  },
  
  /* Call this function when waiting for content to load */
  /*waitFor: function(content) {
    OTC.loading.append(content);
  }
  */
  
  events: {
    /* This will run when the application loads */
    /* This load event should probably go into the object constructor. Fix this */
    load: function() {
      OTC_UI.render(['loginBox', 'mainTabs']);
      OTC_UI.update(['exchangeRates']);
      
      OTC.events.bind('login', function() {
        $("#login-box").dialog('close');
        /* Load all the user data into the application */
        OTC_UI.update('username');
      });
    },
  },
};

/*
* This is effectively the 'model'. All application state should be held in this object.
* This should not depend on OTC_UI.
* Dependencies: OTC_BACKEND
*/

OTC = {
  logged_in: false,
  websocket: null,
  
  username: null,
  
  /* Events management */
  
  _events : {},
  
  events: {
    bind: function(event, f) {
      this._events[event].append(f);
    },
    trigger: function(event, info) {
      if(!this._events[event]) {
        console.log('Uncaught event: '+event);
        return;
      }
      this._events[event].forEach(function(f) { f(info); });
    }
  }
  
  /* Log in the user with the IRC server, and run a callback after that is done */
  login: function(username, password, success, failure) {
    if(OTC.logged_in) {
      failure('User is already logged in');
    } else {
      OTC.username=username;
      success();
    }
  }
}


/* This is basically the 'data source'. It will do until I get the actual IRC-communicating backend sorted. */
/* Dependencies: None */
OTC_BACKEND = {
  exchangeRates: {
    ask: 88.76000,
    bid: 87.18166,
    spread: 1.57834,
  },
}

/* Triggers the OTC_UI load event */
$(OTC_UI.events.load);
