(function () {
    'use strict';

    angular
        .module('EComApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$location'];

    function homeController($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'homeController';

        activate();

        function activate() { }
    }
})();
