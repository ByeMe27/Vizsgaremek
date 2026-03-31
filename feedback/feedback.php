<?php
include "./sql.php";
session_start();
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodyData = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {
    case 'feedbacks':
        if($method != "GET"){
            return http_response_code(405);
        }
        
        if(empty($_GET["kategoria"])){
            echo json_encode(["valasz" => "Nincs megadva akeresett kategoria"]);
            http_response_code(400);
            return;
        }
        else if ($_GET["kategoria"] == "osszes"){
            
            $feedback_listSQL = "SELECT visszajelzes.szoveg, visszajelzes.kategoria, visszajelzes.datumido, felhasznalo.name AS nev FROM visszajelzes INNER JOIN felhasznalo ON felhasznalo.id = visszajelzes.felh_id ORDER BY visszajelzes.datumido DESC";
            $feedback_list = lekeres($feedback_listSQL);

            echo json_encode($feedback_list);
            return;
        }
        else{
            $filtered_feedbacks_SQL = "SELECT visszajelzes.szoveg, visszajelzes.kategoria, visszajelzes.datumido, felhasznalo.name AS nev FROM visszajelzes INNER JOIN felhasznalo ON felhasznalo.id = visszajelzes.felh_id WHERE visszajelzes.kategoria = ? ORDER BY visszajelzes.datumido DESC";
            $filtered_feedbacks = lekeres($filtered_feedbacks_SQL, "s", [$_GET["kategoria"]]);

            echo json_encode($filtered_feedbacks);
            return;
        }

        
        
    break;

    case 'newfeedback':
        if($method != "POST") return http_response_code(405);

        if(empty($bodyData["szoveg"]) ||empty($bodyData["kategoria"])){
            http_response_code(400);
            echo json_encode(["valasz" => "Hiányos adatok"]);
            return;
        }

        $newfeedbackSQL = "INSERT INTO visszajelzes(felh_id, szoveg, kategoria, datumido) VALUES (?,?,?,NOW())";
        $newfeedback = valtoztatas($newfeedbackSQL,"iss", [$_SESSION["user_id"],$bodyData["szoveg"], $bodyData["kategoria"]] );

        if($newfeedback > 0){
            return http_response_code(201);
        }
        else{
            http_response_code(400);
            echo json_encode(["valasz" => "Sikertelen feltöltés"]);
            return;
        }


    break;

    case 'userslatestpost':
        if($method != "GET") return http_response_code(405);

        $latest_SQL = "SELECT datumido FROM visszajelzes WHERE felh_id = ? ORDER BY datumido DESC LIMIT 1";
        $latest = lekeres($latest_SQL, "i", [$_SESSION["user_id"]]);


        $latestCommentTime = strtotime($latest["datumido"]);
        $now = time();

        $diffSeconds = $now - $latestCommentTime;
        $diffMinutes = $diffSeconds / 60;
        $remaining = ceil(30 - $diffMinutes);

        echo json_encode(["varjmeg" => $remaining]);
        http_response_code(200);
        return;
    break;


    

    
    default:
        # code...
        break;


}
session_destroy()


?>