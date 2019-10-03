<?php
/** ***************************************************************
 *   Manager for Aquapp, aquarium manager
 *   Author: Nicolas ZOHAR
 *   Date: March 2012
 ** ***************************************************************/
date_default_timezone_set('Europe/Paris');

$jsonDataFile = '../data/dataAquapp.json';
$jsonDataFileBkp = '../data/dbbackup/dataAquapp.json.';

$json_data = getDBContent($jsonDataFile);

//Backup previous db file
//saveDBContent($jsonDataFileBkp.substr($json_data['lastupdate'],0,10), $json_data);
$bkpDate = substr($json_data['lastupdate'],0,10);
copy($jsonDataFile, $jsonDataFileBkp.$bkpDate);

if(isset($_POST['p'])){
    switch($_POST['p']){
        case 'log':         $tbName = 'dataLogs';
                            $newEntry = addLogEntry();
                            break;
        case 'inventory':   $tbName = 'dataInventory';
                            $newEntry = addInventoryEntry();
                            break;
        case 'controls':    $tbName = 'dataControls';
                            $newEntry = addControlsEntry();
                            break;   
        case 'links':       $tbName = 'dataLinks';
                            $newEntry = addLinksEntry();
                            break;                                   
        default:            $newEntry = -1;
    }
    
    if($newEntry > -1) { 
        $json_data[$tbName][] = $newEntry; 
        $json_data['lastupdate'] = date("Y-m-d H:m");
        saveDBContent($jsonDataFile, $json_data);
        echo "Ajoute avec succes !";
    } else {
        echo "Erreur ! Veuillez renseigner tous les champs !".$_POST['p'].$_POST['date'];
    }
} else {
    echo "Veuillez choisir un type d'entree a ajouter !".$_POST."?";
}

/* ************************* DB Manager ******************************* */

function getDBContent($jsonFile){
    $jsonFileContent = file_get_contents($jsonFile);
    return json_decode($jsonFileContent, true);
}

function saveDBContent($jsonFile, $jsonContent){
    file_put_contents($jsonFile, json_encode($jsonContent));
}

/* ************************* Add line functions *********************** */
function addInventoryEntry(){
    if(isset($_POST['name']) && isset($_POST['category'])){
        return array (  "img"           => $_POST['img'],
                        "name"          => $_POST['name'],
                        "manufacturer"  => isset($_POST['manufacturer']) ? $_POST['manufacturer'] : '',
                        "description"   => isset($_POST['description']) ? nl2br($_POST['description']) : '',
                        "category"      => $_POST['category'],
                        "buyDate"       => isset($_POST['buyDate'])     ? $_POST['buyDate'] : '',
                        "useDate"       => isset($_POST['useDate'])     ? $_POST['useDate'] : '',
                        "unitPrice"     => isset($_POST['unitPrice'])   ? (float)$_POST['unitPrice'] : '',
                        "quantity"      => isset($_POST['quantity'])    ? (float)$_POST['quantity'] : '' 
                    );
    } 
    return -1;
}

function addLogEntry(){
    if(isset($_POST['date']) && isset($_POST['action'])){
        return array ( "date" => $_POST['date'], "action" => $_POST['action'], "comment" => $_POST['comment'] );
    } 
    return -1;
}

function addControlsEntry(){
    if(isset($_POST['date']) && isset($_POST['source'])){
        return array (  "date"    => $_POST['date'],
                        "source"  => $_POST['source'],
                        "ph"      => isset($_POST['ph']) ? (float)$_POST['ph'] : '',
                        "gh"      => isset($_POST['gh']) ? (float)$_POST['gh'] : '',
                        "kh"      => isset($_POST['kh']) ? (float)$_POST['kh'] : '',
                        "no2"     => isset($_POST['no2'])? (float)$_POST['no2'] : '',
                        "no3"     => isset($_POST['no3'])? (float)$_POST['no3'] : '',
                        "cl2"     => isset($_POST['cl2'])? (float)$_POST['cl2'] : '',
                        "temp"    => isset($_POST['temp'])? (float)$_POST['temp'] : ''
                    );
    } 
    return -1;
}

function addLinksEntry(){
    if(isset($_POST['title']) && isset($_POST['url'])){
        return array ( "title" => $_POST['title'], "url" => $_POST['url'] );
    } 
    return -1;
}


?>