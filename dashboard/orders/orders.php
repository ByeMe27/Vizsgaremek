<?php
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {
    case 'query':
        if ($method != "GET") {
            return http_response_code(405);
        }

        $querySQL = "SELECT rendeles.id AS id, rendeles.datumido AS datumido, termek.nev AS nev, termek.ar AS ar, rendeles.statusz_id AS statusz_id FROM `rendeles` INNER JOIN rendelestartalma ON rendeles.id = rendelestartalma.rend_id INNER JOIN termek ON rendelestartalma.term_id = termek.id ORDER BY rendeles.id DESC;";
        $query = dataQuery($querySQL);

        if($query) {
            echo json_encode($query);
        } else {
            return http_response_code(500);
        }
        
        break;
    
    case 'change':
        if ($method != "PUT") {
            return http_response_code(405);
        }

        if (empty($bodydatas["id"]) || empty($bodydatas["statusz_id"])) 
        {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $changeSQL = "UPDATE rendeles SET statusz_id = ? WHERE id = ?";
        $change = dataChange($changeSQL, "ii", [$bodydatas["statusz_id"], $bodydatas["id"]]);

        if($change) {
            echo json_encode(["Sikeres módósítás!"], JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        
        break;

    case 'delete':
        if ($method != "DELETE") {
            return http_response_code(405);
        }

        if (empty($bodydatas["id"])) 
        {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }
        
        $deleteSQL = "DELETE FROM rendeles WHERE id = ?";
        $delete = dataChange($deleteSQL, "i", [$bodydatas["id"]]);

        if($delete) {
            echo json_encode(["Sikeres törlés!"], JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        
        break;

}

?>