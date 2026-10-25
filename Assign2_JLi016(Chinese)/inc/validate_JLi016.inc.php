<?php
/*
 * Name: Jinran Lin
 * Student ID: 300395016
 * Assignment 2: Form Validation
 * File: inc/validate_JLi016.inc.php
 * Purpose: validate every input submitted by the user and
 *          return an associative errors array.
 *          When an input is not valid, a new entry is added to the array
 *          with the form input name as key and its error message as value.
 */

require_once __DIR__ . '/utility_JLi016.inc.php'; // needed to check department/courses against the data files

function validate(){
    $errors = [];

    // check the name    
    $name = filter_input(INPUT_POST, 'name');
    if (empty($name)) {
        $errors['name'] = 'Please enter your fullname';
    } elseif (!preg_match("/^[a-zA-Z' -]+$/", $name)) {
        // only letters, spaces, hyphens and apostrophes are allowed
        $errors['name'] = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    } elseif (str_word_count($name) < 2) {
        // must have both a first name and a last name
        $errors['name'] = 'Please enter both your first and last name.';
    }

    // check the id    
    $pattern = [ "options" => [ "regexp" => "/^\d{10}$/" ]];
    $id = filter_input(INPUT_POST, 'studentID', FILTER_VALIDATE_REGEXP, $pattern);
    if (empty($id)) {
        // empty($id) also covers null (missing) and false (failed filter)
        $errors['studentID'] = 'ID should be ten digit number';
    }

    // check the email    
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    if (empty($email)) {
        $errors['email'] = 'Please enter the correct email address';
    }

    // check the term    
    $pattern = ["options" => ["regexp" => "/^(Winter|Summer|Fall) 202[0-6]$/"]];
    $term = filter_input(INPUT_POST, 'term', FILTER_VALIDATE_REGEXP, $pattern);
    if (empty($term)) {
        $errors['term'] = 'Please enter the correct term between Winter 2020 until Fall 2026';
    }

    // check the dept
    $dept      = filter_input(INPUT_POST, 'department');
    $deptArray = readData('department.csv');
    if (empty($dept) || !array_key_exists($dept, $deptArray)) {
        $errors['department'] = 'Please select one of the departments';
    }

    // check the course
    // FILTER_REQUIRE_ARRAY is a flag, so it is passed as the 4th (options) argument
    $courses = filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
    $courseArray = readData('courses.txt');
    if (empty($courses)) {
        $errors['courses'] = 'Please select one of the courses';
    } else {
        foreach ($courses as $course) {
            if (!array_key_exists($course, $courseArray)) {
                $errors['courses'] = 'Please select one of the courses';
                break;
            }
        }
    }

    // check the status  
    $status = filter_input(INPUT_POST, 'status');
    if (empty($status) || !in_array($status, ['domestic', 'international'])) {
        $errors['status'] = 'Please select one of the statuses';
    }

    return $errors;
}
