<?php

function adatokLekerese($muvelet, $tipusok = null, $adatok = null) {

    $db = new mysqli("localhost", "root", "", "fejlesztokozpont");

    if($db->connect_errno != 0) {
        return $db->connect_error;
    }

    if($tipusok != null && $adatok != null) {
        $stmt = $db->prepare($muvelet);
        $stmt->bind_param($tipusok, ...$adatok);
        $stmt->execute();
        $eredmeny = $stmt->get_result();
    }
    else {
        $eredmeny = $db->query($muvelet);
    }

    if($db->errno != 0) {
        return $db->error;
    }

    if($eredmeny->num_rows==0) {
        return [];
    }

    return $eredmeny->fetch_all(MYSQLI_ASSOC);

}

function adatokvaltoztatasa($muvelet, $tipusok = null, $adatok = null) {

    $db = new mysqli("localhost", "root", "", "fejlesztokozpont");

    if($db->connect_errno != 0) {
        return $db->connect_error;
    }

    if($tipusok != null && $adatok != null) {
        $stmt = $db->prepare($muvelet);
        $stmt->bind_param($tipusok, ...$adatok);
        $stmt->execute();
    }
    else {
         $db->query($muvelet);
    }

    if($db->errno != 0) {
        return $db->error;
    }

    return $db->affected_rows > 0 ? true: false;

}
?>