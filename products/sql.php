<?php
function lekeres($sql, $types = null, $data = null) {

    $db = new mysqli("localhost", "root", "", "bufe");

    if($db->connect_errno != 0) {
        return $db->connect_error;
    }

    if($types != null && $data != null) {
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$data);
        $stmt->execute();
        $result = $stmt->get_result();
    }
    else {
        $result = $db->query($sql);
    }

    if($db->errno != 0) {
        return $db->error;
    }

    if($result->num_rows==0) {
        return [];
    }

    return $result->fetch_all(MYSQLI_ASSOC);

}

function valtoztatas($sql, $types = null, $data = null) {

    $db = new mysqli("localhost", "root", "", "bufe");

    if($db->connect_errno != 0) {
        return $db->connect_error;
    }

    if($types != null && $data != null) {
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$data);
        $stmt->execute();
    }
    else {
        $db->query($sql);
    }

    if($db->errno != 0) {
        return $db->error;
    }

    return $db->affected_rows > 0 ? true: false;

}
?>