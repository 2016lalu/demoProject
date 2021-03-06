// Ionic Starter App
  /*
	var myApp = angular.module("starter", ["ionic", "firebase"]);
	myApp.run(function($ionicPlatform) {
	  ...
	});
   */
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngStorage', 'starter.controllers', 'firebase',])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
       
if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $rootScope.userEmail = null;
        $rootScope.baseUrl = 'https://laluprasad.firebaseio.com/';
        var authRef = new Firebase($rootScope.baseUrl);
        $rootScope.newUser = new Firebase($rootScope.baseUrl);
        $rootScope.auth = $firebaseAuth(authRef);

        $rootScope.show = function(text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading..',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $rootScope.hide = function() {
            $ionicLoading.hide();
        };

        $rootScope.notify = function(text) {
            $rootScope.show(text);
            $window.setTimeout(function() {
                $rootScope.hide();
            }, 1999);
        };

        $rootScope.logout = function() {
            $rootScope.auth.$logout();
            $rootScope.checkSession();
        };

        $rootScope.checkSession = function() {
			//alert("call");
            var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
                if (error) {
                    // no action yet.. redirect to default route
                    $rootScope.userEmail = null;
                    $window.location.href = '#/auth/signin';
                } else if (user) {
                    // user authenticated with Firebase
                    $rootScope.userEmail = user.email;
                    $window.location.href = ('/app/home');
                } else {
                    // user is logged out
                    $rootScope.userEmail = null;
                    $window.location.href = '#/auth/signin';
                }
            });
        }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
     
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
   .state('auth', {
            url: "/auth",
            abstract: true,
            templateUrl: "templates/auth.html"
        })
        .state('auth.signin', {
            url: '/signin',
            views: {
                'auth-signin': {
                    templateUrl: 'templates/auth-signin.html',
                    controller: 'SignInCtrl'
                }
            }
        })
        .state('auth.signup', {
            url: '/signup',
            views: {
                'auth-signup': {
                    templateUrl: 'templates/auth-signup.html',
                    controller: 'SignUpCtrl'
                }
            }
        })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('app.device', {
      url: '/device',
      views: {
        'menuContent': {
          templateUrl: 'templates/device.html',
          controller:'devicetCtrl'
 
        }
      }
    })
  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller:'userProfileCtrl'
 
        }
      }
    })
      .state('app.category', {
      url: '/category',
      views: {
        'menuContent': {
          templateUrl: 'templates/category.html',
          controller:'categoryCtrl'

        }
      }
    })
  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'

        }
      }
    })
    .state('app.chat', {
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'chatController'

        }
      }
    })
    
    .state('app.list', {
      url: '/list',
      views: {
        'menuContent': {
          templateUrl: 'templates/list.html',
          controller : 'listCtrl'

        }
      }
    })
    
     .state('app.contacts', {
      url: '/contacts',
      views: {
        'menuContent': {
          templateUrl: 'templates/contacts.html',
          
        }
      }
    });

 
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/signin');
})
.factory('Message', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://laluprasad.firebaseio.com/');
		var messages = $firebase(ref.child('messages'));
     
     Firebase.goOffline();
   
     console.log(messages);


   
		var Message = {
			all: messages,
			create: function (message) {
				return messages.$add(message);
			},
			get: function (messageId) {
				return $firebase(ref.child('messages').child(messageId)).$asObject();
			},
			delete: function (message) {
				return messages.$remove(message);
			}
		};

		return Message;

	}
	]).factory('aksQuestion', ['$firebase',
  function($firebase) {
    var ref = new Firebase('https://laluprasad.firebaseio.com/');
    var messages = $firebase(ref.child('aksNow'));

     console.log(messages);


   
    var aksQuestion = {
      all: messages,
      create: function (message) {
        return messages.$add(message);
      },
      get: function (messageId) {
        return $firebase(ref.child('aksNow').child(messageId)).$asObject();
      },
      delete: function (message) {
        return messages.$remove(message);
      }
    };

    return aksQuestion;

  }
  ])
  .directive('appFilereader', function($q) {
    /*
    made by elmerbulthuis@gmail.com WTFPL licensed
    */
    var slice = Array.prototype.slice;

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;

        ngModel.$render = function() {}

        element.bind('change', function(e) {
          var element = e.target;
          if(!element.value) return;

          element.disabled = true;
          $q.all(slice.call(element.files, 0).map(readFile))
            .then(function(values) {
              if (element.multiple) ngModel.$setViewValue(values);
              else ngModel.$setViewValue(values.length ? values[0] : null);
              element.value = null;
              element.disabled = false;
            });

          function readFile(file) {
            var deferred = $q.defer();

            var reader = new FileReader()
            reader.onload = function(e) {
              deferred.resolve(e.target.result);
            }
            reader.onerror = function(e) {
              deferred.reject(e);
            }
            reader.readAsDataURL(file);

            return deferred.promise;
          }

        }); //change

      } //link

    }; //return

  }) //appFilereader

.value('usersOnline', 0);
