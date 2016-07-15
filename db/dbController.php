<?php

switch ($_POST['fichero']) {

    case 'users':
        switch ($_POST['action']) {
            case 'new': 
            newUser();
            break;
            
            case 'update':
            updateUser();
            break;

            case 'delete':
            deleteUser();
            break;

            default:
            break;
        }
    break;
}
function newUser(){
    $file = $_POST['file'];
    $newData = [];
    $newData["user"] = $_POST['user'];
    $newData["password"] = $_POST['password'];
    $newData["firstname"] = $_POST['firstname'];
    $newData["lastname"] = $_POST['lastname'];
    $newData["mail"] = $_POST['email'];
    

        //decodifica el json y lo pasamos a un array php
    $tempArray = json_decode(file_get_contents($file));

        //añadimos los nuevos datos al array
    array_push($tempArray, $newData);

        //convierte el array php con los nuevos datos a json
    $jsonData = json_encode($tempArray);

        //reemplaza los datos anteriores del archivo json con los nuevos datos
    file_put_contents($file, $jsonData);
}

/*
function updateUser(){
    $file = $_POST['file'];

    //decodifica el json y lo pasamos a un array php
    $tempArray = json_decode(file_get_contents($file));

    foreach ($tempArray as $user){
        if ($user->dni == $_POST["dni"]){
            //user es la posicion (el objeto entero) del array en la que estoy
            $user->user = $_POST["user"];
            $user->mail = $_POST["mail"];
            $user->password = $_POST["password"];
        }
    }

    $jsonData = json_encode($tempArray);

    //reemplaza los datos anteriores del archivo json con los nuevos datos
    file_put_contents($file, $jsonData);
}

function deleteUser(){
    $file = $_POST['file'];

    //decodifica el json y lo pasamos a un array php
    $tempArray = json_decode(file_get_contents($file));

    for ($i = 0; $i < count($tempArray); $i++){
        if ($tempArray[$i]->dni == $_POST["dni"]){
            //user es la posicion (el objeto entero) del array en la que estoy
            unset($tempArray[$i]);
        }
    }

    $jsonData = json_encode($tempArray);

        //reemplaza los datos anteriores del archivo json con los nuevos datos
    file_put_contents($file, $jsonData);
}*/
?>