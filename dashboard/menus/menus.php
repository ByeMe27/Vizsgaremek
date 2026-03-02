<?php
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {

    case 'query':
        if ($method != "GET") return http_response_code(405);

        $menusSQL = "
            SELECT m.id, m.name, m.price, m.img,
                   GROUP_CONCAT(t.nev SEPARATOR ', ') AS termekek
            FROM menuk m
            LEFT JOIN menutermek mt ON mt.menu_id = m.id
            LEFT JOIN termek t ON t.id = mt.termek_id
            GROUP BY m.id
            ORDER BY m.id DESC
        ";
        $menus = dataQuery($menusSQL);

        if ($menus) {
            echo json_encode($menus, JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        break;

    case 'select':
        if ($method != "GET") return http_response_code(405);

        $productSQL = "SELECT id, nev FROM termek;";
        $products = dataQuery($productSQL);

        if ($products) {
            echo json_encode($products, JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        break;

    case 'selectmenu':
        if ($method != "GET") return http_response_code(405);

        $menuSQL = "SELECT id, name FROM menuk;";
        $menus = dataQuery($menuSQL);

        if($menus) {
            echo json_encode($menus, JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        break;

    case 'upload':
        if ($method != "POST") return http_response_code(405);

        if (
            empty($_POST["name"]) ||
            empty($_POST["termek_id1"]) ||
            empty($_POST["termek_id2"]) ||
            empty($_POST["price"])
        ) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
            echo json_encode(["Hiba" => "Nem érkezett kép!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $namematchSQL = "SELECT * FROM menuk WHERE name = ?";
        $namematch = dataQuery($namematchSQL, "s", [$_POST["name"]]);
        if (!empty($namematch)) {
            echo json_encode(["Hiba" => "Ez a menünév már foglalt!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $targetDir = "./uploads/";
        if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
        $filename = time() . "_" . basename($_FILES["image"]["name"]);
        $targetFile = $targetDir . $filename;
        if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            echo json_encode(["Hiba" => "Kép mentése sikertelen!"]);
            return http_response_code(500);
        }

        $insertMenuSQL = "INSERT INTO menuk (name, price, img) VALUES (?, ?, ?)";
        $insertMenu = dataChange($insertMenuSQL, "sis", [
            $_POST["name"],
            $_POST["price"],
            $filename
        ]);
        if (!$insertMenu) {
            echo json_encode(["Hiba" => "Menü mentése sikertelen!"]);
            return http_response_code(500);
        }

        $menu_id = dataQuery("SELECT id FROM menuk WHERE name = ?", "s", [$_POST["name"]])[0]["id"];

        dataChange("INSERT INTO menutermek (menu_id, termek_id) VALUES (?, ?)", "ii", [$menu_id, $_POST["termek_id1"]]);
        dataChange("INSERT INTO menutermek (menu_id, termek_id) VALUES (?, ?)", "ii", [$menu_id, $_POST["termek_id2"]]);

        echo json_encode(["Siker" => "Menü sikeresen létrehozva!"]);
        break;

    case 'change':
        if ($method != "PUT") return http_response_code(405);

        if(empty($bodydatas["id"]) || empty($bodydatas["name"]) || empty($bodydatas["price"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $changeSQL = "UPDATE menuk SET name = ?, price = ? WHERE id = ?";
        $change = dataChange($changeSQL, "sii", [$bodydatas["name"], $bodydatas["price"], $bodydatas["id"]]);

        if ($change) {
            echo json_encode(["Siker" => "Menü sikeresen módosítva!"]);
        } else {
            return http_response_code(500);
        }
        break;

    case 'delete':
        if ($method != "DELETE") return http_response_code(405);
        if (empty($bodydatas["id"])) {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $menu_id = $bodydatas["id"];
        dataChange("DELETE FROM menutermek WHERE menu_id = ?", "i", [$menu_id]);
        $delete = dataChange("DELETE FROM menuk WHERE id = ?", "i", [$menu_id]);

        if ($delete) {
            echo json_encode(["Siker" => "Menü sikeresen törölve!"]);
        } else {
            return http_response_code(500);
        }
        break;
}
?>