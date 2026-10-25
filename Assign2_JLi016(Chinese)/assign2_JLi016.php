<?php
/*
 * Name: Jinran Lin
 * Student ID: 300395016
 * Course: 3280 - Backend Web Development
 * Assignment 2: Form Validation
 * File: assign2_JLi016.php (main controller)
 */

// require all the inc files
require_once 'inc/utility_JLi016.inc.php';   // readData() : read data files
require_once 'inc/validate_JLi016.inc.php';  // validate() : validate submitted data
require_once 'inc/page_JLi016.inc.php';      // showForm() / showData() : display pages

// read all data files
$deptArray   = readData('department.csv');   // key/value pairs for the department select
$courseArray = readData('courses.txt');      // key/value pairs for the course checkboxes

// initializes variables
$errors = [];
$isSubmitted = ($_SERVER['REQUEST_METHOD'] === 'POST');

// if the form is submitted
if ($isSubmitted) {
    // validate
    $errors = validate();
}

// if the form is submitted and the data is valid
if ($isSubmitted && empty($errors)) {
    // display the submitted data
    showData();
// else
} else {
    // display the form (with error messages if any)
    showForm($deptArray, $courseArray, $errors);
}
