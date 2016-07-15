
var app = angular.module('cine',['ui.bootstrap','ngRoute']);//en el array inyectamos dependencias

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
	})


	.otherwise({
		redirectTo: "/",
		
	})
}]);


//Active menu
app.controller("menuController",["$scope","$location",function($scope,$location){
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
			'action': 'new',
			'user': $scope.user, 
			'password': $scope.password,
			'firstname': $scope.firstname,
			'lastname': $scope.lastname,
			'email': $scope.email
		};
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

app.controller("formLoginController",['$scope','$http','$location',function ($scope,$http,$location){
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
			$location.path("/main");
		}
	
	}

}]);
//COntroller carousel
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

	for (var i = 0; i < 4; i++) {
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