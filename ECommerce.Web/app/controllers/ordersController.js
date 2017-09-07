(function () {
    'use strict';

    angular.module('EComApp').controller('ordersController', ordersController);

    ordersController.$inject = ['$location','ordersService'];

    function ordersController($location, ordersService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Order List';

        vm.orderlist = [];
        //getOrders(ordersService);
        //function getOrders(ordersService) {
        //    ordersService.getOrders().then(function (response) {
        //        vm.orderlist = response.data;
        //    }, function (error) {
        //        console.log(error);
        //    });
        //}
    }
})();
