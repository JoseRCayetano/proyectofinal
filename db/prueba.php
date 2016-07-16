<?php
// Esto le dice a PHP que usaremos cadenas UTF-8 hasta el final
mb_internal_encoding('UTF-8');
 
// Esto le dice a PHP que generaremos cadenas UTF-8
mb_http_output('UTF-8');
 

$data = json_decode(file_get_contents("php://input"));
switch ($data->file){
	case 'users.json':
		switch($data->action){
			case 'newUser':
				newUser($data);
			break;
			case 'newFavoriteMovie':
				newFavoriteMovie ($data);
			break;
			case 'deleteFavoriteMovie':
				deleteFavoriteMovie ($data);
			break;
		}
	break;
}

function newUser($data){
	$newData = [];
	$newData["user"] = $data->user;;
	$newData["password"] = $data->password;
	$newData["firstname"] = $data->firstname;
	$newData["lastname"] = $data->lastname;
	$newData["mail"] = $data->email;
	$newData["groups"] = [];
	$newData["favorite"] = [];
	$newData["viewed"] = [];
	$newData["bookmark"] = [];
	$file = $data->file;
	echo $file;
	//decodifica el json y lo pasamos a un array php
	$tempArray = json_decode(file_get_contents($file));
	 //añadimos los nuevos datos al array
	array_push($tempArray, $newData);
	//convierte el array php con los nuevos datos a json
	$jsonData = json_encode($tempArray);
	//reemplaza los datos anteriores del archivo json con los nuevos datos
	file_put_contents($file, $jsonData);
}
function newFavoriteMovie ($data){
	$file = $data->file; //File to read/write

	$userPosition = (int)$data->userPosition; //Position user
	
	//New object movie
	$newMovie = [];
	$newMovie["title"] = $data->newViewedMovie;
	$newMovie["duration"] = $data->duration;

	$newMovie["genders"] = $data->genders;
		
	$tempArray = json_decode(file_get_contents($file));
	array_push($tempArray[$userPosition]->viewed,$newMovie);
	$jsonData = json_encode($tempArray,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
	file_put_contents($file, $jsonData);
	
}

function deleteFavoriteMovie ($data){
	$file = $data->file; //File to read/write

	$userPosition = (int)$data->userPosition; //Position user
	$moviePosition = (int)$data->moviePosition;
	echo $moviePosition;
	$tempArray = json_decode(file_get_contents($file));

	unset($tempArray[$userPosition]->viewed[$moviePosition]);
	$jsonData = json_encode($tempArray,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
	file_put_contents($file, $jsonData);
	
}

?>