<?php
/*
 * Name: Jinran Lin
 * Student ID: 300395016
*/

function readData($fileName){
// This function is to read data file and return 
// the key/value pairs to be used by some form controls    
    $pairs = [];
    // data files are stored in the data folder next to the inc folder
    $path = __DIR__ . '/../data/' . $fileName;

    if (!file_exists($path) || !is_readable($path)) {
        return $pairs; // file missing -> return an empty array
    }

    $handle = fopen($path, 'r');
    if ($handle === false) {
        return $pairs;
    }

    // fgetcsv() reads one line and splits it on the comma
    while (($row = fgetcsv($handle)) !== false) {
        if (count($row) >= 2) {
            $key          = trim($row[0]);
            $value        = trim($row[1]);
            $pairs[$key]  = $value;
        }
    }
    fclose($handle);

    return $pairs;
}
