<?php
include "./sql.php";

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$uri = explode("/", $uri);

switch (end($uri)) {
    case 'query':
        if ($method != "GET") {
            return http_response_code(405);
        }

        $all_ordersSQL = "SELECT COUNT(*) AS db FROM rendeles WHERE statusz_id > 1";
        $all_orders = dataQuery($all_ordersSQL);

        $total_revenueSQL = "SELECT SUM(termek.ar * rendelestartalma.mennyiseg) AS osszeg FROM rendelestartalma INNER JOIN termek ON termek.id = rendelestartalma.term_id INNER JOIN rendeles ON rendeles.id = rendelestartalma.rend_id WHERE rendeles.statusz_id > 1";
        $total_revenue = dataQuery($total_revenueSQL);

        $avg_orderSQL = "SELECT AVG(rend_osszeg.osszeg) AS atlag FROM (SELECT rendelestartalma.rend_id, SUM(termek.ar * rendelestartalma.mennyiseg) AS osszeg FROM rendelestartalma INNER JOIN termek ON termek.id = rendelestartalma.term_id INNER JOIN rendeles ON rendeles.id = rendelestartalma.rend_id WHERE rendeles.statusz_id > 1 GROUP BY rendelestartalma.rend_id) AS rend_osszeg";
        $avg_order = dataQuery($avg_orderSQL);

        $top_productSQL = "SELECT termek.nev, SUM(rendelestartalma.mennyiseg) AS db FROM rendelestartalma INNER JOIN termek ON termek.id = rendelestartalma.term_id GROUP BY termek.id ORDER BY db DESC LIMIT 1";
        $top_product = dataQuery($top_productSQL);

        $by_statusSQL = "SELECT statusz.nev, COUNT(rendeles.id) AS db FROM rendeles INNER JOIN statusz ON statusz.id = rendeles.statusz_id WHERE rendeles.statusz_id > 1 GROUP BY rendeles.statusz_id";
        $by_status = dataQuery($by_statusSQL);

        $feedbackSQL = "SELECT kategoria, COUNT(*) AS db FROM visszajelzes GROUP BY kategoria ORDER BY db DESC";
        $feedback = dataQuery($feedbackSQL);

        $feedback_listSQL = "SELECT visszajelzes.szoveg, visszajelzes.kategoria, visszajelzes.datumido, felhasznalo.name AS nev FROM visszajelzes INNER JOIN felhasznalo ON felhasznalo.id = visszajelzes.felh_id ORDER BY visszajelzes.datumido DESC LIMIT 8";
        $feedback_list = dataQuery($feedback_listSQL);

        echo json_encode([
            "osszes_rendeles"   => $all_orders[0]["db"],
            "osszes_bevetel"    => $total_revenue[0]["osszeg"] ?? 0,
            "atlag_bevetel"     => $avg_order[0]["atlag"] ?? 0,
            "top_termek"        => $top_product[0]["nev"] ?? null,
            "statuszok"         => $by_status,
            "visszajelzesek"    => $feedback,
            "visszajelzes_lista"=> $feedback_list
        ], JSON_UNESCAPED_UNICODE);

        break;
}
?>