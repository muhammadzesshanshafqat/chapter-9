var demoApp = angular.module('demo', []);
demoApp.controller('MainController', ['$scope', 'todoWebService', function($scope, todoWebService) {
    //setup model
    var vm = {};
    vm.list = [];

    //startinitial load of list
    todoWebService.getItems().then(function(response) {
        vm.list = response.data.items;
    });

    vm.addItem = function() {
        var item = {
            details: vm.newItemdetails
        };

        //clear it from UI
        vm.newItemdetails = '';

        //send the request to server and add item once done
        todoWebService.addItem(item).then(function(response) {
            vm.list.push({
                _id: response.data.itemId,
                details: item.details
            });
        });
    };

    vm.removeItem = function(itemToremove) {
        //remove it from list and send the server a request
        vm.list = vm.list.filter(function(item) {return item._id !== itemToremove._id});
        todoWebService.removeItem(itemToremove);
    };

    //for new items;
    vm.newItemdetails = '';

    //expose viewmodel(vm) using $scope
    $scope.vm = vm;
}]);


demoApp.service('todoWebService', ['$http', function($http) {
    var root = '/todo';
    return {
        getItems: function() {return $http.get(root)},
        addItem: function(item) {return $http.post(root, item)},
        removeItem: function(item) {return $http.delete(root + '/' + item._id)} 
    }
}])