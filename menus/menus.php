<?php
session_start();
include "./sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {
    case 'minden':
        if($method != "GET") return http_response_code(405);
        
        $minden_SQL = "
            SELECT m.id, m.name, m.price, m.img,
                   GROUP_CONCAT(t.nev SEPARATOR ', ') AS termekek
            FROM menuk m
            LEFT JOIN menutermek mt ON mt.menu_id = m.id
            LEFT JOIN termek t ON t.id = mt.termek_id
            GROUP BY m.id
            ORDER BY m.id DESC
        ";
        $minden = lekeres($minden_SQL);

        if(!empty($minden)){
            echo json_encode($minden);
            return;
        }
        else{
            http_response_code(400);
            echo json_encode(["valasz" => "Sikertelen lekérés"]);
            return;
        }
    break;
    
    default:
        # code...
        break;
}


?>