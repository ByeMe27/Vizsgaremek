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

    case 'select':
        if ($method != "GET") {
            http_response_code(405);
            return;
        }

        $productSQL = "SELECT id, nev FROM termek;";
        $product = dataQuery($productSQL);

        if ($product) {
            echo json_encode($product, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
        }

        break;

    case 'upload':
        if ($method != "POST") {
            http_response_code(405);
            return;
        }

        $nev = $_POST["nev"] ?? '';
        $kategoria = $_POST["kategoria"] ?? '';
        $leiras = $_POST["leiras"] ?? '';
        $ar = $_POST["ar"] ?? '';

        if (!$nev || !$kategoria || !$leiras || !$ar) {
            http_response_code(400);
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(["Hiba" => "Nem érkezett kép!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $namematchSQL = "SELECT * FROM termek WHERE nev = ?";
        $namematch = dataQuery($namematchSQL, "s", [$nev]);
        if (!empty($namematch)) {
            http_response_code(400);
            echo json_encode(["Hiba" => "Kérlek használj egy másik elnevezést a termékhez!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $targetDir = "./uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $filename = time() . "_" . basename($_FILES["image"]["name"]);
        $targetFile = $targetDir . $filename;

        if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            http_response_code(500);
            echo json_encode(["Hiba" => "Kép mentése sikertelen!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $uploadSQL = "INSERT INTO termek (nev, kategoria, leiras, img, ar) VALUES (?, ?, ?, ?, ?)";
        $upload = dataChange($uploadSQL, "ssssi", [$nev, $kategoria, $leiras, $filename, $ar]);

        if ($upload) {
            echo json_encode(["Siker" => "Sikeres feltöltés!"], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["Hiba" => "Adatbázis hiba!"], JSON_UNESCAPED_UNICODE);
        }

        break;

    case 'change':
        if ($method != "PUT") {
            return http_response_code(405);
        }

        if(empty($bodydatas["id"]) || empty($bodydatas["nev"]) || empty($bodydatas["kategoria"]) || empty($bodydatas["leiras"]) || empty($bodydatas["ar"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $changeSQL = "UPDATE termek SET nev = ?, kategoria = ?, leiras = ?, ar = ? WHERE id = ?";
        $change = dataChange($changeSQL, "sssii", [$bodydatas["nev"], $bodydatas["kategoria"], $bodydatas["leiras"], $bodydatas["ar"], $bodydatas["id"]]);

        if ($change) {
            echo json_encode(["Sikeres módosítás!"], JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }

        break;

    case 'delete':
        if ($method != "DELETE") {
            return http_response_code(405);
        }

        if (empty($bodydatas["id"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $deleteSQL = "DELETE FROM termek WHERE id = ?";
        $delete = dataChange($deleteSQL, "s", [$bodydatas["id"]]);

        if ($delete) {
            echo json_encode(["Sikeres törlés!"], JSON_UNESCAPED_UNICODE);
        }
        else {
            return http_response_code(500);
        }

        break;
}

?>
