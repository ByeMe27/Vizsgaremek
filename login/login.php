<?php
session_start();
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {

    case 'login':
        if ($method !== "POST") {
            return http_response_code(405);
        }

        if (empty($bodydatas["email"]) || empty($bodydatas["pwd"])) {
            http_response_code(400);
            echo json_encode(["error" => "Kérlek, töltsd ki az összes mezőt!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $queryemailSQL = "SELECT * FROM felhasznalo WHERE email = ?";
        $queryemail = dataQuery($queryemailSQL, "s", [$bodydatas["email"]]);

        if (empty($queryemail)) {
            http_response_code(400);
            echo json_encode(["error" => "Hibás email!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        $user = $queryemail[0];

        if (!password_verify($bodydatas["pwd"], $user["pwd"])) {
            http_response_code(401);
            echo json_encode(["error" => "Hibás jelszó!"], JSON_UNESCAPED_UNICODE);
            return;
        }

        session_regenerate_id(true);

        $_SESSION["user_id"] = $user["id"];
        $_SESSION["name"]    = $user["name"];
        $_SESSION["email"]   = $user["email"];
        $_SESSION["class"]   = $user["class"];
        $_SESSION["role"]    = $user["role"];
        $_SESSION["last_activity"] = time();

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Sikeres bejelentkezés!",
            "user" => [
                "name" => $user["name"],
                "role" => $user["role"]
            ]
        ], JSON_UNESCAPED_UNICODE);
        return;

    case 'me':
        if (!isset($_SESSION["user_id"])) {
            http_response_code(401);
            echo json_encode(["loggedIn" => false]);
            return;
        }

        echo json_encode([
            "loggedIn" => true,
            "name" => $_SESSION["name"],
            "role" => $_SESSION["role"]
        ]);
        return;

    case 'logout':
    session_start(); 

    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();

    echo json_encode(["success" => true]);
    return;


    default:
        http_response_code(404);
        echo json_encode(["error" => "Ismeretlen végpont"]);
        return;
        break;
}
?>
