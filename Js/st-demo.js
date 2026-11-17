;(function() {
  'use strict';
  

  $(activate);


  function activate() {
      var $ = jQuery.noConflict();
    $('.nav-tabs')
      .scrollingTabs({
        enableSwiping: true
      })      

  }
}());
