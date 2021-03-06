'use strict';

angular.module('users').controller('DiscussionController', ['$scope', '$http', '$filter', '$state', '$location', '$window', 'Discussion', 'Game', 'discussionGameResolve', 'UserGames', 'Authentication', '$stateParams',
  function ($scope, $http, $filter, $state, $location, $window, Discussion, Game, discussionGameResolve, UserGames, Authentication, $stateParams) {

    $scope.game = discussionGameResolve;
    $scope.discussion = Discussion;
    $scope.user = Authentication.user;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;
    $scope.games = [];

    UserGames.get(function (data) {
      var currentUser = data;
      console.log(data);
      $scope.games = currentUser.games;
      console.log($scope.games);
    });

    // Remove existing Discussion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        $scope.discussion.$remove($state.go('discussions.list'));
      }
    }

    // Save Discussion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.discussionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if ($scope.discussion._id) {
        $scope.discussion.$update(successCallback, errorCallback);
      } else {
        $scope.discussion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log('this is the res');
        console.log(res);
        // $state.go('game', {
        //   gameId: selectedGame._id
        // });
        $state.go('game({gameId: res.game})');
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    }

    $scope.removeDiscussionFromGame = function (discussion, game) {
      var currentGame = $scope.game;
      // //var discussion = Discussion.get({discussionId: discussion._id});
      // console.log(discussion);
      // console.log('here comes game');
      console.log(currentGame);
      if (game._id === discussion.game) {
        currentGame.discussions.push(discussion);
      }

      var gameToSave = new Game(currentGame);

      gameToSave.$update(function () {
        // $state.go('game', {
        //   gameID: game._id
        // });
        $state.go('chat', {
          //discussionId: discussion._id
        });
      }, function(errorResponse) {
        $scope.error = errorResponse.data;
      });
    };

    //adds discussion to that games discussion array
    $scope.addDiscussionToGame = function (discussion, game) {
      console.log($scope.game);
      var currentGame = $scope.game;
      // //var discussion = Discussion.get({discussionId: discussion._id});
      // console.log(discussion);
      // console.log('here comes game');
      console.log(currentGame);
      currentGame.discussions.push(discussion);

      var gameToSave = new Game(currentGame);

      gameToSave.$update(function () {
        // $state.go('game', {
        //   gameID: game._id
        // });
        $state.go('chat', {
          //discussionId: discussion._id
        });
      }, function(errorResponse) {
        $scope.error = errorResponse.data;
      });
    };

    // adds discussion to database
    $scope.addDiscussion = function() {
      console.log($scope.game);
      var newDiscussion = new Discussion({
        title: $scope.title,
        //content: $scope.content,
        game: $scope.game,
        comments: [],
        originalPoster: $scope.user
      });

      newDiscussion.$save(function(response) {
        console.log(response);
        // $location.path('/discussions/');
        $scope.addDiscussionToGame(response, $scope.game);
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.title = '';
        $scope.content = '';
        $scope.game = '';
        $scope.error = errorResponse.data;
      });

    };
  }
]);
