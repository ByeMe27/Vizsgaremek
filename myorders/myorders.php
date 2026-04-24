<?php
session_start();
include "./sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);

header("Content-Type: application/json");
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["valasz" => "Nincs bejelentkezve."]);
    exit;
}

$action = $_GET["action"] ?? "";
switch ($action) {

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
                rendelestartalma.term_id,
                rendelestartalma.menu_id,
                COALESCE(termek.nev, menuk.name) AS nev,
                COALESCE(termek.ar, menuk.price) AS ar
            FROM rendeles
            INNER JOIN statusz ON statusz.id = rendeles.statusz_id
            INNER JOIN rendelestartalma ON rendelestartalma.rend_id = rendeles.id
            LEFT JOIN termek ON termek.id = rendelestartalma.term_id
            LEFT JOIN menuk ON menuk.id = rendelestartalma.menu_id
            WHERE rendeles.felh_id = ?
            AND rendeles.statusz_id != 1
            ORDER BY rendeles.datumido DESC";



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
                "mennyiseg" => $sor["mennyiseg"],
                "term_id"   => $sor["term_id"],
                "menu_id"   => $sor["menu_id"]
            ];
        }

        $rendeles_lista = array_values($rendeles_lista);

        http_response_code(200);
        echo json_encode($rendeles_lista);
        return;
    break;

    case 'orderagain':
        if ($method != "POST") {
            http_response_code(405);
            return;
        }

        if (empty($bodyData["termekek"])) {
            http_response_code(400);
            echo json_encode(["valasz" => "Hiányos adatok."]);
            return;
        }

        
        $db = new mysqli("localhost", "root", "", "bufe");

        if ($db->connect_errno != 0) {
            http_response_code(500);
            echo json_encode(["valasz" => "Adatbázis kapcsolódási hiba."]);
            return;
        }

        
        $stmt = $db->prepare("INSERT INTO rendeles(felh_id, datumido, statusz_id) VALUES (?, NOW(), 2)");
        $stmt->bind_param("i", $_SESSION["user_id"]);
        $stmt->execute();

        if ($db->errno != 0) {
            http_response_code(500);
            echo json_encode(["valasz" => "Sikertelen rendelés leadás."]);
            return;
        }

        
        $ujRendelesId = $db->insert_id;

   
        foreach ($bodyData["termekek"] as $tetel) {
            $term_id   = !empty($tetel["term_id"]) ? (int)$tetel["term_id"] : null;
            $menu_id   = !empty($tetel["menu_id"]) ? (int)$tetel["menu_id"] : null;
            $mennyiseg = (int)($tetel["mennyiseg"] ?? 1);

            $stmt2 = $db->prepare("INSERT INTO rendelestartalma(rend_id, term_id, menu_id, mennyiseg) VALUES (?, ?, ?, ?)");
            $stmt2->bind_param("iiii", $ujRendelesId, $term_id, $menu_id, $mennyiseg);
            $stmt2->execute();
        }

        http_response_code(201);
        echo json_encode(["valasz" => "Rendelés sikeresen leadva!"]);
        return;
    break;

    default:
        http_response_code(404);
        echo json_encode(["valasz" => "Ismeretlen végpont."]);
    break;
}

session_destroy();
?>