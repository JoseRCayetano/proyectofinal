
var app = angular.module('cine',['ui.bootstrap','ngRoute','ngStorage','ngCookies']);//en el array inyectamos dependencias

app.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when("/",{
		templateUrl: "views/landing_page.html",
	})
	.when("/login",{
		templateUrl: "views/login.html",
	}).when("/register",{
		templateUrl: "views/register.html"
	}).when("/main",{
		templateUrl: "views/main.html"
	}).when("/post",{
		templateUrl: "db/dbController.php"
	}).when("/movie/:title",{
		templateUrl: "views/movie.html"
	}).when("/cine/:title/:cine",{
		templateUrl: "views/cine.html"
	})
	.otherwise({
		redirectTo: "/",
		
	})

}]);
//Factory to do pettition to the DB
/*
app.factory('dataBase', ['$http',function ($http,method,url,formData,headers){
	var request = {};
	
	request.send = function (){
		$http.post({method,url,formData,headers}).
		success(function(response) {
			$scope.codeStatus = response.data;
			console.log(response)
		}).
		error(function(response) {
			console.log("mal")
			$scope.codeStatus = response || "Request failed";
		});

	}

}])*/
//Cine view controller
app.controller("cinemaController",["$scope","$http","$routeParams",function ($scope,$http,$routeParams){
	
	$scope.title = $routeParams.title;
	$scope.cine = $routeParams.cine;
	$scope.dataLoaded = false;
	
	$http.get("db/cartelera.json").success (function (data){
        $scope.cartelera= data;
        $scope.dataLoaded = true;

    });

}]);

//Controller main page user
app.controller("mainController",["$scope","$http",'$localStorage',function($scope,$http,$localStorage){
	$scope.dataLoaded = false;
	$http.get("db/cartelera.json").success (function (data){
        $scope.cartelera= data;
        $scope.dataLoaded = true;

    });

    //Function viewed film
    $scope.checkFilm = function (buttonPressed,movie,duration,genders){
    	$http.get("db/users.json").success(function (data){

    		var userPosition = getUserPosition(data,$localStorage.user);
    		var moviePosition = getViewedMoviePosition(data,userPosition,movie);
    		console.log("Posicion peli --> "+moviePosition)
    		console.log("Nombre peli --> "+movie);
    		console.log("Posicion user -->"+userPosition);
    		//Si no está lo meto
    		if (moviePosition === -1){
    			console.log("no esta")
    			var method = 'POST';
				var url = 'db/prueba.php';
				var FormData = {
					'file': 'users.json',
					'action': 'newFavoriteMovie',
					'userPosition': userPosition,
					'newViewedMovie': movie,
					'duration': duration,
					'genders': genders
				};
				var headers= {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

				//dataBase.send($http,method,url,FormData,headers);
				
	    		$http({
					method: method,
					url: url,
					data: FormData,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				}).
				success(function(response) {
					//$scope.codeStatus = response.data;
					console.log("meto peli");
					$http.get("db/users.json").success(function (dataDb){
						$localStorage.users = dataDb;

					});
				}).
				error(function(response) {
					console.log("mal")
					$scope.codeStatus = response || "Request failed";
				});

	    	}else{// si está se elimina
	    		console.log("si esta");
	    		var method = 'POST';
				var url = 'db/prueba.php';
				var FormData = {
					'file': 'users.json',
					'action': 'deleteFavoriteMovie',
					'userPosition': userPosition,
					'moviePosition': moviePosition,
				};
				var headers= {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

				//dataBase.send($http,method,url,FormData,headers);
				
	    		$http({
					method: method,
					url: url,
					data: FormData,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				}).
				success(function(response) {
					$scope.codeStatus = response.data;
					console.log("Elimino peli-->"+response.data)
					$http.get("db/users.json").success(function (dataDb){
						$localStorage.users = dataDb;
					})

				}).
				error(function(response) {
					console.log("mal")
					$scope.codeStatus = response || "Request failed";
				});

	    	}
    })
   
}

    //Get user poition
    function getUserPosition(data,username){
    	return data.map (function (users){
    				return users.user;
    			}).indexOf(username)
    }
    //Get movie position
    function getViewedMoviePosition (data,userPosition,movie){
    	return data[userPosition].viewed.map(function(movieViewed){
				return movieViewed.title;
			}).indexOf(movie);
    }
    

}])


//Movie file controller

app.controller("movieController",["$scope","$http","$routeParams", function ($scope,$http,$routeParams){
	$scope.title = $routeParams.title;
	$http.get("db/cartelera.json").success (function (data){
        $scope.cartelera= data;
        $scope.dataLoaded = true;

    });
}])

//Active menu
app.controller("menuController",["$scope","$location",'$localStorage',function($scope,$location,$localStorage){
	$scope.userlogged= $localStorage.user; //To show who is logged
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}]);

app.controller("formRegisterController" ,['$scope','$http','$location',function ($scope,$http,$location){

	
	var method = 'POST';
	var url = 'db/prueba.php';
	$scope.codeStatus = "";
	$scope.save = function() {
		
		var FormData = {
			'file': 'users.json',
			'action': 'newUser',
			'user': $scope.user, 
			'password': $scope.password,
			'firstname': $scope.firstname,
			'lastname': $scope.lastname,
			'email': $scope.email
		};

		//application/json
		//
		$http({
			method: method,
			url: url,
			data: FormData,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		}).
		success(function(response) {
			$scope.codeStatus = response.data;
			console.log(response)
		}).
		error(function(response) {
			console.log("mal")
			$scope.codeStatus = response || "Request failed";
		});
		return false;
	};

		/*console.log("function");
		$http.post('db/dbController.php', { 
										fichero: 'db/users.json',
										action: 'new',
										user: $scope.user, 
										password: $scope.password,
										firstname: $scope.firstname,
										lastname: $scope.lastname,
										email: $scope.email
										})
		.success(function(data) {
			
			$scope.names = eval(data);
			console.log(data)
			console.log("success");
		})
		.error(function(data) {
			console.log('Error:');
		});
		*/
}]);

//Login controller
app.controller("formLoginController",['$scope','$http','$location','$localStorage',function ($scope,$http,$location,$localStorage){
	//Check if credential are in db
	
	$scope.checkUser = function(){
		var url="db/users.json";
		$http.get(url).success(function (dataDb){
			checkInDb(dataDb,$scope.user,$scope.password);

		});
	}

	function checkInDb(db,user,password){
		
		var index = db.map(function (element){
			return element.user;
		}).indexOf(user);
		if (index != -1){
			$localStorage.user = user;
			$location.path("/main");
		}
	
	}

}]);

//Rating controller

app.controller('ratingController', function ($scope) {
  $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];
});


//Controller carousel
app.controller("carouselController", function ($scope) {
	$scope.myInterval = 3000;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	var slides = $scope.slides = [];
	var currIndex = 0;

	$scope.addSlide = function() {
		
		slides.push({
			image: 'img/landing_carousel/'+slides.length+".jpg",
			text: ['Vive la mejor experiencia del cine','Disfruta de las mejores películas','Junto a personas de tus mismos intereses','A que esperas'][slides.length % 4],
			id: currIndex++
		});
	};

	$scope.randomize = function() {
		var indexes = generateIndexesArray();
		assignNewIndexesToSlides(indexes);
	};

	for (var i = 0; i < 5; i++) {
		$scope.addSlide();
	}

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
  	for (var i = 0, l = slides.length; i < l; i++) {
  		slides[i].id = indexes.pop();
  	}
  }

  function generateIndexesArray() {
  	var indexes = [];
  	for (var i = 0; i < currIndex; ++i) {
  		indexes[i] = i;
  	}
  	return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
  	var tmp, current, top = array.length;

  	if (top) {
  		while (--top) {
  			current = Math.floor(Math.random() * (top + 1));
  			tmp = array[current];
  			array[current] = array[top];
  			array[top] = tmp;
  		}
  	}

  	return array;
  }
})

//CUstome directive to load menu
app.directive('nglandingmenu',function(){
	return{
		restrict: 'E', // PAra custom de html
		templateUrl: 'views/landing_menu.html'
	}
})

//CUstome directive to load user menu
app.directive('usermenu',function(){
	return{
		restrict: 'E', // PAra custom de html
		templateUrl: 'views/user_menu.html'
	}
})
//CUstome directive to load navigator user menu
app.directive('navigatorusermenu',function(){
	return{
		restrict: 'E', // PAra custom de html
		templateUrl: 'views/navigator-user-menu.html'
	}
})