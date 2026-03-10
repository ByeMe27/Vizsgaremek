<?php
include "./sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);


switch (end($uri)) {
    case 'szures':
        if($method != "GET"){
            return http_response_code(405);
        }

        ///////////////////////////////csak kategoria alapján szűrés
        if(!empty($_GET["kategoria"]) && empty($_GET["min"]) && empty($_GET["max"])){
            $kat_alapjan_SQL= "SELECT id, nev, leiras,  img, ar FROM termek WHERE kategoria = ?";
            $kat_alapjan = lekeres($kat_alapjan_SQL, "s", [$_GET["kategoria"]]);

            if(!empty($kat_alapjan)){
                echo json_encode($kat_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }///////////////////////////////kategoria és min alapján
        else if(!empty($_GET["kategoria"]) && !empty($_GET["min"]) && empty($_GET["max"])){
            $min_kat_alapjan_SQL = "SELECT id, nev, leiras,  img, ar FROM termek WHERE kategoria = ? AND ar >= ?";
            $min_kat_alapjan = lekeres($min_kat_alapjan_SQL, "si", [$_GET["kategoria"], $_GET["min"]]);

            if(!empty($min_kat_alapjan)){
                echo json_encode($min_kat_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }///////////////////////////////kategoria és max alapján
        else if(!empty($_GET["kategoria"]) && empty($_GET["min"]) && !empty($_GET["max"])){
            $max_kat_alapjan_SQL = "SELECT id, nev, leiras,  img, ar FROM termek WHERE kategoria = ? AND ar <= ?";
            $max_kat_alapjan = lekeres($max_kat_alapjan_SQL, "si", [$_GET["kategoria"], $_GET["max"]]);

            if(!empty($max_kat_alapjan)){
                echo json_encode($max_kat_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }///////////////////////////min-max alapján szűrés
        else if(empty($_GET["kategoria"]) && !empty($_GET["min"]) && !empty($_GET["max"])){
            $ar_alapjan_SQL= "SELECT id, nev, leiras,  img, ar FROM termek WHERE ar BETWEEN ? AND ? ";
            $ar_alapjan = lekeres($ar_alapjan_SQL, "ii", [$_GET["min"], $_GET["max"]]);

            if(!empty($ar_alapjan)){
                echo json_encode($ar_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }////////////////////////////csak min alapján
        else if(empty($_GET["kategoria"]) && !empty($_GET["min"]) && empty($_GET["max"])){
            $min_alapjan_SQL="SELECT id, nev, leiras,  img, ar FROM termek WHERE ar >= ? ";
            $min_alapjan = lekeres($min_alapjan_SQL, "i", [$_GET["min"]]);

            if(!empty($min_alapjan)){
                echo json_encode($min_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }////////////////////////////csak max alapján
        else if(empty($_GET["kategoria"]) && empty($_GET["min"]) && !empty($_GET["max"])){
            $max_alapjan_SQL="SELECT id, nev, leiras,  img, ar FROM termek WHERE ar <= ? ";
            $max_alapjan = lekeres($max_alapjan_SQL, "i", [$_GET["max"]]);

            if(!empty($max_alapjan)){
                echo json_encode($max_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }/////////////////////////////minden alapján szűrés 
        else if(!empty($_GET["kategoria"]) && !empty($_GET["min"]) && !empty($_GET["max"])){
            $ar_kat_alapjan_SQL = "SELECT id, nev, leiras,  img, ar FROM termek WHERE kategoria = ? AND ar BETWEEN ? AND ?";
            $ar_kat_alapjan = lekeres($ar_kat_alapjan_SQL, "sii", [$_GET["kategoria"], $_GET["min"], $_GET["max"]]);

            if(!empty($ar_kat_alapjan)){
                echo json_encode($ar_kat_alapjan);
                return;
            }
            else{
                http_response_code(400);
                echo json_encode(["valasz" => "A keresési feltételekhez nincs találat."]);
                return;
            }
        }
        else{
            http_response_code(400);
            echo json_encode(["valasz" => "Hibás keresési feltételek"]);
            return;
        }
    break;


    case 'minden':
        if($method != "GET") return http_response_code(405);
        
        $minden_SQL = "SELECT id, nev, leiras, img, ar FROM termek";
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

        $felhasznaloid = 1;
        $datumido = date("Y-m-d H:i:s");
        $statusz_id = 1;


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
                "INSERT INTO rendelestartalma (term_id, rend_id, mennyiseg) VALUES (?, ?, ?)",
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
        echo json_encode("default");
    break;
}

?>