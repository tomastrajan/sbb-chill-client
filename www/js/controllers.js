angular.module('starter.controllers', [])

    .controller('IntroCtrl', function ($scope, $state, UserService) {
        $scope.continue = function(status) {
            UserService.setStatus(status);
            $state.go('intro1');
        };
    })

    .controller('Intro1Ctrl', function ($scope, $state, UserService) {
        $scope.newUser = {};
        $scope.isUser = function() {
            return !!UserService.user.id;
        }
        $scope.user = UserService.user;

        $scope.isDisabled = function() {
            return !$scope.newUser.name || !$scope.newUser.seatId;
        };
        $scope.continue = function() {
            UserService.setName($scope.newUser.name);
            UserService.setSeatId($scope.newUser.seatId);
            UserService.save();
            $scope.newUser = {};
            $state.go('tab.dash');
        };
        $scope.continue1 = function() {
            UserService.update();
            $state.go('tab.dash');
        };
    })

    .controller('DashCtrl', function ($scope, $http, $interval) {

        $scope.seats = [];
        $scope.users = [];

        resolveData();

        $interval(function() {
            resolveData();
        }, 3000);

        function resolveData() {
            getUsers()
                .then(getSeats)
                .then(function() {
                    $scope.users.forEach(function(user) {
                        $scope.seats.forEach(function(seat) {
                            if (seat.id === user.seatId) {
                                seat.user = user.disturb ? 'chat' : 'dnd';
                                seat.username = user.name;
                            }
                        });
                    });
                    convertSeatsForUi();
                });
        }

        function getSeats() {
            return $http.get('http://hack.ronky.net/seat').then(function(response) {
            //return $http.get('/api/seat').then(function(response) {
                $scope.seats = response.data.sort(sortById);
            }, function(err) {
                console.log(JSON.stringify(err));
            });
        }

        function getUsers() {
            return $http.get('http://hack.ronky.net/user').then(function(response) {
            //return $http.get('/api/user').then(function(response) {
                $scope.users = response.data;

            }, function(err) {
                console.log(JSON.stringify(err));
            });
        }

        function sortById(a, b) {
            if (parseInt(a.id) < parseInt(b.id)) {
                return -1;
            }
            if (parseInt(a.id) > parseInt(b.id)) {
                return 1;
            }
            return 0;
        }

        function convertSeatsForUi() {
            var result = [];
            var row = [];
            $scope.seats.forEach(function(seat, index) {
                row.push(seat);
                if ((index + 1) % 4 === 0) {
                    result.push(row.slice());
                    row = [];
                }
            });
            $scope.seats = result;
        }

    })

    .controller('ChatsCtrl', function ($scope, $http, $interval, UserService) {


        $scope.messages = [];
        $scope.newItem = {};

        getMessages();

        $interval(function() {
            getMessages();
        }, 3000);

        function getMessages() {
            return $http.get('http://hack.ronky.net/message').then(function(response) {
            //return $http.get('/api/message').then(function(response) {
                $scope.messages = response.data;
                assingAvatars();
            }, function(err) {
                console.log('update err', JSON.stringify(err));
            });
        }

        function assingAvatars() {
            $scope.messages.forEach(function(msg) {
                console.log(JSON.stringify(msg));
                msg.avatar = getAvatarUrl((parseInt(msg.userId) % 5) + 1);
            });
        }

        function getAvatarUrl(avatarId) {
            return 'img/' + avatarId + '.png';
        }



        $scope.addItem = function () {
            $scope.newItem.username = UserService.user.name;
            $scope.newItem.userId = UserService.user.id;
            $scope.newItem.seatId = UserService.seatId;
            $scope.newItem.beaconId = 'beacon1';

            $http.post('http://hack.ronky.net/message', $scope.newItem).then(function (response) {
            //$http.post('/api/message', $scope.newItem).then(function (response) {
                // reset
                $scope.newItem.text = "";
                getMessages();
            }, function (err) {
                console.log('msg  err', JSON.stringify(err));
            });
        };

       
    })

    .controller('AccountCtrl', function ($scope, $state, UserService) {

        $scope.user = UserService.user;

        $scope.persistUser = function() {
            UserService.persistUser();
        };

        $scope.update = function() {
            UserService.update();
        };

        $scope.logout = function() {
            UserService.logout();
            $state.go('intro');
        };

    });
