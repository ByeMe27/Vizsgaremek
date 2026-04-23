<?php
include "./sql.php"; 

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);
$bodydatas = json_decode(file_get_contents("php://input"), true);

switch (end($uri)) {
    case 'query':
        if ($method != "GET") {
            return http_response_code(405);
        }

        $querySQL = "SELECT rendeles.id AS id, rendeles.datumido AS datumido, rendeles.statusz_id AS statusz_id FROM `rendeles` INNER JOIN rendelestartalma ON rendeles.id = rendelestartalma.rend_id WHERE rendeles.statusz_id <> 4 GROUP BY rendeles.id ORDER BY rendeles.id DESC;";
        $query = dataQuery($querySQL);

        foreach ($query as $key => $value) {
            $query2SQL = "
                SELECT 
                    COALESCE(termek.nev, menuk.name) AS nev,
                    COALESCE(termek.ar, menuk.price) * rendelestartalma.mennyiseg AS ar,
                    rendelestartalma.mennyiseg,
                    rendelestartalma.menu_id
                FROM rendelestartalma
                LEFT JOIN termek ON rendelestartalma.term_id = termek.id
                LEFT JOIN menuk ON rendelestartalma.menu_id = menuk.id
                WHERE rendelestartalma.rend_id = ?
            ";
            $tetelek = dataQuery($query2SQL, "i", [$value["id"]]);

            foreach ($tetelek as &$tetel) {
                if (!empty($tetel["menu_id"])) {
                    $menuTermekSQL = "
                        SELECT termek.nev
                        FROM menutermek
                        INNER JOIN termek ON menutermek.termek_id = termek.id
                        WHERE menutermek.menu_id = ?
                    ";
                    $menuTermekek = dataQuery($menuTermekSQL, "i", [$tetel["menu_id"]]);
                    $tetel["menu_termekek"] = array_column($menuTermekek, "nev");
                }
                unset($tetel["menu_id"]);
            }
            unset($tetel);

            $query[$key]["termekek"] = $tetelek;
        }
        echo json_encode($query);
        
        break;
    
    case 'change':
        if ($method != "PUT") {
            return http_response_code(405);
        }

        if (empty($bodydatas["id"]) || empty($bodydatas["statusz_id"])) 
        {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }

        $changeSQL = "UPDATE rendeles SET statusz_id = ? WHERE id = ?";
        $change = dataChange($changeSQL, "ii", [$bodydatas["statusz_id"], $bodydatas["id"]]);

        if($change) {
            echo json_encode(["Sikeres módósítás!"], JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        
        break;

    case 'delete':
        if ($method != "DELETE") {
            return http_response_code(405);
        }

        if (empty($bodydatas["id"])) 
        {
            echo json_encode(["Hiba" => "Hiányzó adatok!"], JSON_UNESCAPED_UNICODE);
            return http_response_code(400);
        }
        
        $deleteSQL = "DELETE FROM rendeles WHERE id = ?";
        $delete = dataChange($deleteSQL, "i", [$bodydatas["id"]]);

        if($delete) {
            echo json_encode(["Sikeres törlés!"], JSON_UNESCAPED_UNICODE);
        } else {
            return http_response_code(500);
        }
        
        break;

}

?>