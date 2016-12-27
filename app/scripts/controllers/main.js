'use strict';

/**
 * @ngdoc function
 * @name mundiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mundiApp
 */
  /*global $:false */

angular.module('mundiApp')
  .controller('MainCtrl',['$scope','$http', function($scope, $http) {
	var vm = this;
	var auth = '?oauth_consumer_key=0186f08482338d872c8c&oauth_token=814699237b9ff500caee9f85378665429e08b1dc&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1482763869&oauth_nonce=Q5d0GW&oauth_version=1.0&oauth_signature=a4Sdxco6HcO/dNHcgS6XEzTUfoQ=';

	$scope.template = "/views/login.html";

	this.pesquisarUsuario = function(usuario){	 
		$http({ 
	 	method: 'GET',
			url: 'https://api.github.com/users/'+usuario + '/repos'+auth
		}).then(function successCallback(response) {
			vm.usuario = response.data[1].owner.login;
			vm.foto = response.data[1].owner.avatar_url; 
			vm.url = response.data[1].owner.html_url;
			var projects = [];
			$(response.data).each(function() { 
			
			    projects.push({
			    	name: this.name,			
			        url: this.html_url,	
			        forks: this.forks_count, 
			        stars: this.stargazers_count,
			        contributors:  0, //usar api pra pegar response.data.contributors_url
			        commits: 0, //'https://api.github.com/repos/'+usuario +'/'response.data.name+'/
			    });

		    });

			vm.projects = projects;
			vm.commits();
			$scope.template = "/views/main.html";

		});
	};
	this.commits = function(){
			$(vm.projects).each(function() { 
			var project = this;	
			project.grafico = {data: [], quantidade: []};
			//pegar as contribuições	
			
			$http({ 
		 		method: 'GET',
				url: 'https://api.github.com/repos/'+ vm.usuario + '/' +  this.name + '/contributors'+ auth
			}).then(function successCallback(response) {
				project.contributors = response.data.length;
				$(response.data).each(function() { 
					project.commits += this.contributions;
			    });
			});			
			$http({ 
		 		method: 'GET',
				url: 'https://api.github.com/repos/'+ vm.usuario + '/' +  this.name + '/stats/contributors'+ auth
			}).then(function successCallback(resposta) {				
				$(resposta.data).each(function() { 
					$(this.weeks).each(function() { 
						var data = new Date(this.w * 1000).toLocaleDateString();
						project.grafico.data.push(data);
						project.grafico.quantidade.push(this.c);
					});

				});
			});	
		});
	};



}]);