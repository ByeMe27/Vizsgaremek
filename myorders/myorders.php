<?php
session_start();
include "./sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);


switch (end($uri)) {
    case 'myorders':
        if($method != "GET"){
            return http_response_code(405);
        }

        
    break;
    



    default:
        echo json_encode("default ág");
    break;
}

session_destroy();
?>