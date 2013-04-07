# Handles rendering and attaching event handlers to the UI elements.
# This is effectively the 'controller' (and partially the view).
# Only UI-related state should be held here.
# Dependencies: Backend

class UserInterface

  constructor: ->
  
    OTC = new Backend()
            
    @render 'loginBox', 'mainTabs'

    OTC.bind 'data.exchangeRates', @updateContent.exchangeRates
    OTC.requestData 'exchangeRates'
  
    OTC.bind 'login', (data) =>
      unless data.success
        console.log('login failed');
      else
        $('#login-box').dialog 'close'
        # Load all the user data into the application
        @updateContent.username OTC.username
  
  # The functions which render the static sections
  renderSection:
    loginBox: =>
      $("#login-box").dialog
        modal: true
        autoOpen: true
        dialogClass: 'no-close'
        closeOnEscape: false
        draggable: false
      $('#login-submit').button()
      $('#login-form').submit (event) ->
        event.preventDefault()
        OTC.login $('#login-username').val(), $('#login-password').val()
        
    mainTabs: ->
      $('#main-tabs').tabs()
  
  render: (sections...) ->
    @renderSection[section]() for section in sections
  
  # Functions which load/update the dynamic content
  updateContent:
    exchangeRates: (data) ->
      $('#exr-'+prop).text(val) for prop, val of data
    username: (data) ->
      $('#display-username').text data
    

          
      

# This is effectively the 'model'. All application state should be held in this object.
# This should not depend on UserInterface.
# Dependencies: DataSource

class Backend
  loggedIn: false
  websocket: null
  
  username: null
  
  # Events management
  # List of events that you can bind to:
  # login: Fired when the server successfully logs
  # data.*: Fired when data is received from the backend.
  
  
  _events : {}
  
  bind: (event, f) =>
    @_events[event] = @_events[event] || []
    @_events[event].push f
    
  trigger: (event, info) =>
    unless @_events[event]
      console.log "Unbound event: #{event}"
      return
    f info for f in @_events[event]
  
  
  # This function requests data from the backend. The appropriate data.* event will fire when the data is ready
  requestData: (name) ->
    @trigger "data.#{name}", DataSource[name] if DataSource[name]

  
  # Log in the user with the IRC server, then trigger the login event once that's done.
  login: (username, password) ->
    unless @loggedIn
      @username = username
      @trigger 'login', {success:true}


# This is basically the 'data source'. It will do until I get the actual IRC-communicating backend sorted.
# Dependencies: None
DataSource = 
  exchangeRates:
    ask: 88.76000
    bid: 87.18166
    spread: 1.57834

# Triggers the OTC_UI load event
$ ->
  new UserInterface()
