module.exports = function(app, passport) {

  var Event = require('../models/event')
  var User = require('../models/user')

  app.get('/', function(req, res) {

    Event.find({}, function(err, events) {
      res.render('main.ejs', {pickupdata: events, authenticated: req.isAuthenticated()})
    });

  });

  app.post('/', function(req, res) {
    res.render('main.ejs')
  });

  app.get('/logout',function(req,res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/createPickup', function(req, res) {
    const userID = req.user._id
    const data = req.body;
    const newSportsEvent = new Event({ 
      creator_name: data.creator_name,
      event_name: data.event_name,
      pickup_type: data.pickup_type,
      event_date: data.event_date,
      start_time: data.start_time,
      end_time: data.end_time,
      max_attendance: data.max_people,
      location: data.location,
      description: data.description
    });
    
    newSportsEvent.save(function (err,event) {
      User.findByIdAndUpdate(userID,
        {$push: {createdEvents: event._id }},
        function(err, doc) {
            if (err) {throw err}
            res.redirect('/');
        });
      });
  });

  app.get('/login',function(req,res) {
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));


  app.get('/signup', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

    // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    User.findById(req.user._id, function (err, user) { 
      Event.find({
          '_id': { $in: user.joinedEvents}
      }, function(err, allJoined){
        Event.find({
            '_id': { $in: user.createdEvents}
        }, function(err, allCreated){
          res.render('profile.ejs', {user: req.user, joined_events: allJoined, created_events: allCreated })
        }); 
      });

    });
  });

  app.get('/startpickup',isLoggedIn, function(req, res) {
    res.render('startpickup.ejs', {user: req.user })
  });

  app.post('/info', function(req, res) {
     const event_id = req.query.id 
      Event.findOne({ _id: event_id }, function(err, event) {
        if (err) throw err;
        if (req.user) {
          User.findById(req.user._id, function (err, user) {
            var joined = false;
            if ( user.joinedEvents.includes(event_id) ) {
              joined = true;
            }
            User.find({}, function(err, users) {
              var all_users = [];
              users.forEach(function(user) {
                if (user.joinedEvents.includes(event_id) ) {
                  all_users.push( user.first_name + " " + user.last_name)
                }
              });
              res.render('info.ejs', {event:event, authenticated: req.isAuthenticated(), joined:joined,logged_in: true, users:all_users })
            });
          });
        }
        else {            
            User.find({}, function(err, users) {
              var all_users = [];
              users.forEach(function(user) {
                if (user.joinedEvents.includes(event_id) ) {
                  all_users.push( user.first_name + " " + user.last_name)
                }
              });
              res.render('info.ejs', {event:event, authenticated: req.isAuthenticated(), joined:false,logged_in: false, users:all_users })
            });
        }
      });
  });


  app.post('/attendEvent', function(req,res) {
    var eventID = req.query.event_id
    var userID = req.user._id
    User.findByIdAndUpdate(userID,
      {$push: {joinedEvents: eventID }},
      {safe: true, upsert: true},
      function(err, doc) {
          if (err) {throw err}
          var url = "/info?id=" + eventID
          console.log(url)
          res.redirect(307, url );
      }
    );
  }) 

  app.post('/removeEvent', function(req,res) {
    var eventID = req.query.event_id
    var userID = req.user._id
    User.findByIdAndUpdate(userID,
      {$pull: {joinedEvents: eventID }},
      function(err, doc) {
          if (err) {throw err}
          var url = "/info?id=" + eventID
          console.log(url)
          res.redirect(307, url );
      }
    );
  }) 

  app.post('/removeCreatedEvent',function(req,res) {
    var eventID = req.query.id
    var userID = req.user._id

    Event.remove({ _id: eventID }, function(err) {
      res.redirect("/profile")
    });
  })

  app.post('/removeSubscribedEvent',function(req,res) {
    var eventID = req.query.id
    var userID = req.user._id

    User.findByIdAndUpdate(userID,
      {$pull: {joinedEvents: eventID }},
      function(err, doc) {
          if (err) {throw err}
          res.redirect("/profile")
      }
    );
  })


  function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on
      if (req.isAuthenticated())
          return next();

      // if they aren't redirect them to the home page
      res.redirect('/login');
  }


}
