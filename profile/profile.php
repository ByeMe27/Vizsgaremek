<?php
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {    
    case 'query':
        if ($method != "GET") {
            http_response_code(405);
            return;
        }

        $requestproductsSQL = "SELECT nev, kategoria, leiras, img, ar FROM termek ORDER BY id DESC";
        $requestproducts = dataQuery($requestproductsSQL);

        if ($requestproducts) {
            echo json_encode($requestproducts, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
        }
        break;
}

?>