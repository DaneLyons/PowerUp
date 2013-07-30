var async = require('async'),
    _ = require('underscore'),
    util = require('util'),
    markdown = require( "markdown" ).markdown,
    inflect = require('i')();
    
exports.trackNew = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  res.render('track/new',{
    "stylesheets":["page"],
    "javascripts":[]
  });
}

exports.record = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  res.render('track/record',{
    "stylesheets":["page"],
    "javascripts":[]
  });
}

exports.timeline = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  res.render('track/timeline',{
    "stylesheets":["page"],
    "javascripts":[]
  });
}