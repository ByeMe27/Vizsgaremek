<?php
include "./sql.php";
session_start();
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {
    case 'feedbacks':
        if ($method != "GET") {
            http_response_code(405);
            return;
        }

        if (empty($_GET["kategoria"])) {
            http_response_code(400);
            echo json_encode(["valasz" => "Nincs megadva a keresett kategoria"]);
            return;
        } else if ($_GET["kategoria"] == "osszes") {
            $feedback_listSQL = "SELECT visszajelzes.szoveg, visszajelzes.kategoria, visszajelzes.datumido, felhasznalo.name AS nev 
                                 FROM visszajelzes 
                                 INNER JOIN felhasznalo ON felhasznalo.id = visszajelzes.felh_id 
                                 ORDER BY visszajelzes.datumido DESC";
            $feedback_list = lekeres($feedback_listSQL);
            echo json_encode($feedback_list);
            return;
        } else {
            $filtered_feedbacks_SQL = "SELECT visszajelzes.szoveg, visszajelzes.kategoria, visszajelzes.datumido, felhasznalo.name AS nev 
                                       FROM visszajelzes 
                                       INNER JOIN felhasznalo ON felhasznalo.id = visszajelzes.felh_id 
                                       WHERE visszajelzes.kategoria = ? 
                                       ORDER BY visszajelzes.datumido DESC";
            $filtered_feedbacks = lekeres($filtered_feedbacks_SQL, "s", [$_GET["kategoria"]]);
            echo json_encode($filtered_feedbacks);
            return;
        }
        break;

    case 'newfeedback':
        if ($method != "POST") {
            http_response_code(405);
            return;
        }

        if (empty($bodyData["szoveg"]) || empty($bodyData["kategoria"])) {
            http_response_code(400);
            echo json_encode(["valasz" => "Hiányos adatok"]);
            return;
        }

        $newfeedbackSQL = "INSERT INTO visszajelzes(felh_id, szoveg, kategoria, datumido) VALUES (?,?,?,NOW())";
        $newfeedback = valtoztatas($newfeedbackSQL, "iss", [$_SESSION["user_id"], $bodyData["szoveg"], $bodyData["kategoria"]]);

        if ($newfeedback === true) {
            http_response_code(201);
            return;
        } else {
            http_response_code(400);
            echo json_encode(["valasz" => "Sikertelen feltöltés"]);
            return;
        }
        break;

    case 'userslatestpost':
        if ($method != "GET") {
            http_response_code(405);
            return;
        }

        $latest_SQL = "SELECT datumido FROM visszajelzes WHERE felh_id = ? ORDER BY datumido DESC LIMIT 1";
        $latest = lekeres($latest_SQL, "i", [$_SESSION["user_id"]]);

        // lekeres() fetch_all-t használ, tehát tömböt kapunk vissza
        if (empty($latest)) {
            http_response_code(200);
            echo json_encode(["varjmeg" => 0]);
            return;
        }

        $latestCommentTime = strtotime($latest[0]["datumido"]);  // [0] kellett!
        $now = time();

        $diffSeconds = $now - $latestCommentTime;
        $diffMinutes = $diffSeconds / 60;
        $remaining = ceil(30 - $diffMinutes);

        // Ha már eltelt a 30 perc, ne adjon vissza negatív számot
        if ($remaining < 0) {
            $remaining = 0;
        }

        http_response_code(200);
        echo json_encode(["varjmeg" => $remaining]);
        return;
        break;

    default:
        break;
}

session_destroy();
?>