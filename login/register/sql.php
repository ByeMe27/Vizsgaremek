<?php
function dataQuery($operation, $types = null, $datas = null) {

    $db = new mysqli("localhost", "root", "", "bufe");

    if($db->connect_errno != 0) {
        return $db->connect_error;
    }

    if($types != null && $datas != null) {
        $stmt = $db->prepare($operation);
        $stmt->bind_param($types, ...$datas);
        $stmt->execute();
        $result = $stmt->get_result();
    }
    else {
        $result = $db->query($operation);
    }

    if($db->errno != 0) {
        return $db->error;
    }

    if($result->num_rows==0) {
        return [];
    }

    return $result->fetch_all(MYSQLI_ASSOC);

}

function dataChange($operation, $types = null, $datas = null) {

    $db = new mysqli("localhost", "root", "", "bufe");

    if($db->connect_errno != 0) {
        return $db->connect_error;
    }

    if($types != null && $datas != null) {
        $stmt = $db->prepare($operation);
        $stmt->bind_param($types, ...$datas);
        $stmt->execute();
    }
    else {
         $db->query($operation);
    }

    if($db->errno != 0) {
        return $db->error;
    }

    return $db->affected_rows > 0 ? true: false;

}
?>