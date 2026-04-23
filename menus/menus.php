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
            SELECT m.id, m.name, m.price, m.img, GROUP_CONCAT(t.nev SEPARATOR ', ') AS termekek
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


    case 'rendeles':

        if ($method != "POST") {
            http_response_code(405);
            return;
        }

        if (empty($bodyData) || !is_array($bodyData)) {
            http_response_code(400);
            echo json_encode(["valasz" => "Üres vagy hibás kosár"]);
            return;
        }

        $felhasznaloid = $_SESSION["user_id"];
        $datumido = date("Y-m-d H:i:s");
        $statusz_id = 2;


        $insert = valtoztatas("INSERT INTO rendeles (felh_id, datumido, statusz_id) VALUES (?, ?, ?)", "isi", [$felhasznaloid, $datumido, $statusz_id]);

        if ($insert !== true) {
            http_response_code(500);
            echo json_encode(["valasz" => "Rendelés létrehozása sikertelen"]);
            return;
        }

        $rendeles = lekeres("SELECT MAX(id) as id FROM rendeles");
        if (empty($rendeles)) {
            http_response_code(500);
            echo json_encode(["valasz" => "Nem sikerült lekérni a rendelés ID-t"]);
            return;
        }
        $rendelesid = $rendeles[0]["id"];

        //rendelestartalma insert
        foreach ($bodyData as $termek) {

            if (!isset($termek["id"]) || !isset($termek["db"])) {
                http_response_code(400);
                echo json_encode(["valasz" => "Hibás termék adat"]);
                return;
            }

            $termekid = (int)$termek["id"];
            $mennyiseg = (int)$termek["db"];

            if ($mennyiseg <= 0) {
                http_response_code(400);
                echo json_encode(["valasz" => "Érvénytelen mennyiség"]);
                return;
            }

            $insertTetel = valtoztatas(
                "INSERT INTO rendelestartalma (menu_id, rend_id, mennyiseg) VALUES (?, ?, ?)",
                "iii",
                [$termekid, $rendelesid, $mennyiseg]
            );

            if ($insertTetel !== true) {
                http_response_code(500);
                echo json_encode(["valasz" => "Rendelés tartalmának mentése sikertelen"]);
                return;
            }
        }

        echo json_encode(["success" => true]);
        return;

    break;
    
    default:
        # code...
        break;
}


?>