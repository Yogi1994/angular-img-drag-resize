'use strict';

// Define the `home` module
var home  = angular.module('home', [
  'ngRoute',
]);

home.component('home', {
  templateUrl: 'components/pages/home/home.template.html',
  controller: function() {
    
  }
})
.config(function($routeProvider) {
  $routeProvider.when('/home', {
    template: '<home></home>'
  });
});
