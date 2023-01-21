<?php

// script takes form input and logs it to a text file
// then returns user to network.html

// open file for writing
$network_entries = fopen("/var/www/greenminds/data/network_entries.txt", "a") or die("Unable to open file!");

// line up variables
$write_entry = "";
$project_name = $_POST["project_name"];
$latitude = $_POST["lat"];
$longitude = $_POST["lng"];
$notes = $_POST["notes"];
$website = $_POST["website"];
$username = $_POST["user_name"];
$useremail = $_POST["user_email"];

$latstring = sprintf("%.8f", $latitude);
$lngstring = sprintf("%.8f", $longitude);

$write_entry = "$project_name,  $latstring, $lngstring, $notes, $website, $username, $useremail\n";
echo $write_entry;

fwrite($network_entries, $write_entry);
fclose($network_entries);

// redirect user to network.html
header("Location: https://greenminds.thedata.place/networks.html");
exit();

?>
