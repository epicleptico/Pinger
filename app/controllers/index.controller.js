(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  var TIMEOUT_TIMER = 500;

  ng.module('mainApp').controller(CONTROLLER_NAME, [ '$log',
    '$scope', '$q', '$http', '$interval', index_controller
  ]);


  function index_controller($log, $scope, $q, $http, $interval) {
    $scope._name = CONTROLLER_NAME;

    $scope.data = [];


    $interval(function(){
      _downloadData().then(_onDataDownloaded).catch(function(){});
    }, TIMEOUT_TIMER);



    function _onDataDownloaded(data) {

      //If we have no data on scope
      if($scope.data.length === 0){
        data.forEach(function(element){
          $scope.data.push({
            ip: element,
            status: 'UP'
          });
        });

        return;
      }


      data.forEach(function(element){
        var dataElement = $scope.data.first(function(itm){ return itm.ip == element; });

        //Exists ?
        if(dataElement) {
          dataElement.status = 'UP';
        } else {
          $scope.data.push({
            ip: element,
            status: 'UP'
          })
        }
      });

      $scope.data.forEach(function(dataElement){
        var element = data.first(function(itm){ return dataElement.ip == itm; });

        if(!element) {
          dataElement.status = 'DOWN';
        }
      });

      $scope.data.sort(function(a, b){

        var aIP = a.ip.split('.');
        var bIP = b.ip.split('.');

        if(aIP[0] != bIP[0]) {
          return parseInt(aIP[0]) > parseInt(bIP[0]) ? 1 : -1;
        }

        if(aIP[1] != bIP[1]) {
          return parseInt(aIP[1]) > parseInt(bIP[1]) ? 1 : -1;
        }

        if(aIP[2] != bIP[2]) {
          return parseInt(aIP[2]) > parseInt(bIP[2]) ? 1 : -1;
        }

        return  parseInt(aIP[3]) >parseInt(bIP[3]) ? 1 : -1;
      });

    }


    var num = 1;

    function _downloadData() {
      var $$q = $q.defer();

      var sp = $http({
        url: 'data/pinger', //+ (num++ % 2),
        method: 'GET',
        cache: false,
      });

      sp.success(function(data){

        if(data.trim().length == 0) {
          $$q.reject();
        }

        $$q.resolve(data
          .split('\n')
          .select(function(elem){ return elem.trim(); })
          .where(function(elem){ return elem && elem.length > 0 && elem.trim().length > 0; }));
      });

      sp.error($$q.reject);


      return $$q.promise;
    }
  }
})(angular);