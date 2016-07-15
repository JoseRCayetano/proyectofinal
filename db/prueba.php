<?php
$data = json_decode(file_get_contents("php://input"));
echo $data->user;

$newData = [];
$newData["user"] = $data->user;;
$newData["password"] = $data->password;
$newData["firstname"] = $data->firstname;
$newData["lastname"] = $data->lastname;
$newData["mail"] = $data->email;
$file = $data->file;


        //decodifica el json y lo pasamos a un array php
$tempArray = json_decode(file_get_contents($file));

        //añadimos los nuevos datos al array
array_push($tempArray, $newData);

        //convierte el array php con los nuevos datos a json
$jsonData = json_encode($tempArray);

        //reemplaza los datos anteriores del archivo json con los nuevos datos
file_put_contents($file, $jsonData);
?>