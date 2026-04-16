<?php
session_start();
include "./sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);


switch (end($uri)) {
    case 'myorders':
        if ($method != "GET") {
            http_response_code(405);
            return;
        }

        $ordersSQL = "SELECT 
                rendeles.id AS rendeles_id,
                rendeles.datumido,
                statusz.nev AS statusz,
                rendelestartalma.mennyiseg,
                COALESCE(termek.nev, menuk.name) AS nev,
                COALESCE(termek.ar, menuk.price) AS ar
            FROM rendeles
            INNER JOIN statusz ON statusz.id = rendeles.statusz_id
            INNER JOIN rendelestartalma ON rendelestartalma.rend_id = rendeles.id
            LEFT JOIN termek ON termek.id = rendelestartalma.term_id
            LEFT JOIN menuk ON menuk.id = rendelestartalma.menu_id
            WHERE rendeles.felh_id = ?
            ORDER BY rendeles.datumido DESC"
        ;

        $orders = lekeres($ordersSQL, "i", [$_SESSION["user_id"]]);

        if (empty($orders)) {
            http_response_code(200);
            echo json_encode([]);
            return;
        }

        $rendeles_lista = [];

        foreach ($orders as $sor) {
            $rid = $sor["rendeles_id"];

            if (!isset($rendeles_lista[$rid])) {
                $rendeles_lista[$rid] = [
                    "rendeles_id" => $rid,
                    "datumido"    => $sor["datumido"],
                    "statusz"     => $sor["statusz"],
                    "termekek"    => []
                ];
            }

            $rendeles_lista[$rid]["termekek"][] = [
                "nev"       => $sor["nev"],
                "ar"        => $sor["ar"],
                "mennyiseg" => $sor["mennyiseg"]
            ];
        }

        $rendeles_lista = array_values($rendeles_lista);

        http_response_code(200);
        echo json_encode($rendeles_lista);
        return;
    break;
    



    default:
        echo json_encode("default ág");
    break;
}

session_destroy();
?>