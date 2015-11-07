angular
    .module('starter.services')

    .factory('UserService', function($http) {

        var USER_KEY = 'sbb.client.user';

        var STATUS = {
            DISTURB: true,
            SILENCE: false
        };

        var user = initUser();

        var service = {
            STATUS: STATUS,

            user: user,

            setStatus: setStatus,
            setSeatId: setSeatId,
            setName: setName,

            logout: logout,

            persistUser: persistUser,
            save: save,
            update: update
        };
        return service;

        function initUser() {
            var user = window.localStorage[USER_KEY] !== 'undefined' ? JSON.parse(window.localStorage[USER_KEY]) : {};
            persistUser();
            return user;
        }

        function setStatus(status) {
            user.disturb = status;
            persistUser();
        }

        function setSeatId(seatId) {
            user.seatId = seatId;
            persistUser();
        }

        function setName(name) {
            user.name = name;
            persistUser();
        }

        function logout() {
            service.user = {};
            persistUser();
        }

        function persistUser() {
            window.localStorage[USER_KEY] = JSON.stringify(user);
            console.log(JSON.stringify(user));
        }

        function save() {
            console.log('save', JSON.stringify(user));
            $http.post('/api/user', user).then(function(response) {
                console.log('save success', JSON.stringify(response.data));
                angular.copy(response.data, user);
                persistUser();
            }, function(err) {
                console.log('save err', JSON.stringify(err));
            });
        }

        function update() {
            console.log('update', JSON.stringify(user));
            $http.put('/api/user/' + user.id, user).then(function(response) {
                console.log('update success', JSON.stringify(response.data));
                angular.copy(response.data, user);
                persistUser();
            }, function(err) {
                console.log('update err', JSON.stringify(err));
            });
        }

        function getRandomName() {
            var adjectives = ['Amazing', 'Sad', 'Happy', 'Funny', 'Blue', 'Dangerous', 'Bright', 'Tasty', 'Sexy', 'Fast'];
            var animal = ['Bird', 'Panda', 'Cat', 'Snake', 'Wolf', 'Lion', 'Whale', 'Tiger', 'Monkey', 'Zebra', 'Unicorn'];
            return adjectives[getRand(0, adjectives.length - 1)] + ' ' + animal[getRand(0, animal.length - 1)] + ' ' + getRand(0, 1000);

            function getRand(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
        }

    });