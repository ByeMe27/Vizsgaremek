<?php
session_start();
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {    
    case 'changename':
        if ($method != "PUT") {
            http_response_code(405);
            return;
        }

        if (empty($bodydatas["name"])) {
            http_response_code(400);
            echo json_encode(["error" => "Kérlek, töltsd ki az összes mezőt!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $changenameSQL = "UPDATE `felhasznalo` SET `name` = ? WHERE `id` = ?";
        $changename = dataChange($changenameSQL, "ss", [$bodydatas["name"], $_SESSION["user_id"]]);

        if ($changename) {
        echo json_encode($changename, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(409);
        }

        break;

    case 'changeclass':
        if ($method != "PUT") {
            http_response_code(405);
            return;
        }

        if (empty($bodydatas["class"])) {
            http_response_code(400);
            echo json_encode(["error" => "Kérlek, töltsd ki az összes mezőt!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $changeclassSQL = "UPDATE `felhasznalo` SET `class` = ? WHERE `id` = ?";
        $changeclass = dataChange($changeclassSQL, "ss", [$bodydatas["class"], $_SESSION["user_id"]]);

        if ($changeclass) {
        echo json_encode($changeclass, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(409);
        }

        break;

     case 'changeemail':
        if ($method != "PUT") {
            http_response_code(405);
            return;
        }

        if (empty($bodydatas["email"])) {
            http_response_code(400);
            echo json_encode(["error" => "Kérlek, töltsd ki az összes mezőt!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $changeemailSQL = "UPDATE `felhasznalo` SET `email` = ? WHERE `id` = ?";
        $changeemail = dataChange($changeemailSQL, "ss", [$bodydatas["email"], $_SESSION["user_id"]]);

        if ($changeemail) {
            echo json_encode($changeemail, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(409);
        }
        break;

     case 'changepasswd':
        if ($method != "PUT") {
            http_response_code(405);
            return;
        }

        $userSQL = "SELECT * FROM felhasznalo WHERE id = ?";
        $user = dataQuery($userSQL, "s", [$_SESSION["user_id"]]);

        $user = $user[0];

        if (empty($bodydatas["pwd"] || empty($bodydatas["newpwd"]))) {
            http_response_code(400);
            echo json_encode(["error" => "Kérlek, töltsd ki az összes mezőt!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (!password_verify($bodydatas["pwd"], $user["pwd"])) {
            http_response_code(400);
            echo json_encode(["error" => "Hibás jelszó!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (($bodydatas["pwd"] == $bodydatas["newpwd"])) {
            http_response_code(400);
            echo json_encode(["error" => "Az új jelszónak, különböznie kell az eredeti jelszótól!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $newpwd = password_hash($bodydatas["newpwd"], PASSWORD_DEFAULT);

        $changepwdSQL = "UPDATE `felhasznalo` SET `pwd` = ? WHERE `id` = ?";
        $changepwd = dataChange($changepwdSQL, "ss", [$newpwd, $_SESSION["user_id"]]);


        if ($changepwd) { 
        echo json_encode($changepwd, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(409);
        }

        break;
}

?>