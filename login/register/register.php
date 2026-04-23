<?php 

include "./sql.php";
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {
    case 'register':
        if ($method != "POST") {
            return http_response_code(405);
        }

        if (empty($bodydatas["name"]) || empty($bodydatas["email"]) || empty($bodydatas["pwd"]) || empty($bodydatas["class"]))
        {
            return http_response_code(400);
        }

        $matchemailSQL = "SELECT email FROM `felhasznalo` WHERE email = ?;";
        $matchemail = dataQuery($matchemailSQL, "s", [$bodydatas["email"]]);

        if (!empty($matchemail)) {
            echo json_encode(["error" => "Van meg regisztrált felhasználó ilyen email címmel!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $hashedPassword = password_hash($bodydatas["pwd"], PASSWORD_DEFAULT);

        $insertSQL = "INSERT INTO felhasznalo (name, email, class, pwd, role) VALUES (?, ?, ?, ?, 'user')";
        $insert = dataChange($insertSQL, "ssss", [$bodydatas["name"], $bodydatas["email"], $bodydatas["class"], $hashedPassword]);

        if ($insert) {
            echo json_encode(["success" => "Sikeres regisztráció!"], JSON_UNESCAPED_UNICODE);
            http_response_code(200);
        } else 
        {
            echo json_encode(["error" => "Hiba történt a regisztráció során!"], JSON_UNESCAPED_UNICODE);
            http_response_code(400);
        }
        break;
}

?>