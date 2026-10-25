<?php
/*
 * Name: Jinran Lin
 * Student ID: 300395016
 * Assignment 2: Form Validation
 * File: inc/page_JLi016.inc.php
 * Purpose: display the form (showForm) and display the
 *          submitted valid data (showData).
 *          The form uses sticky inputs: submitted data is displayed
 *          back in the form controls, and selected/chosen options are
 *          shown as selected or checked appropriately.
 */

require_once __DIR__ . '/utility_JLi016.inc.php'; // not strictly required here, kept for completeness

/**
 * Helper function 1: display the errors array inside a red box.
 * Uses a loop so it works no matter how many errors there are.
 */
function displayErrors(array $errors): void
{
    if (empty($errors)) {
        return; // no error, nothing to display
    }
?>
    <div class="alert alert-danger border-danger" role="alert">
        <ul class="mb-0">
            <?php foreach ($errors as $error): ?>
                <li><?= $error ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php
}

/**
 * Helper function 2: sticky attribute helper.
 * Returns " checked" or " selected" when the submitted value matches
 * the current option, so the browser re-selects / re-checks it.
 */
function stickyAttr($submitted, $optionValue, $attribute = 'checked'): string
{
    return ($submitted !== null && $submitted === $optionValue) ? ' ' . $attribute : '';
}

function showForm($deptArray,$courseArray,$errors=[]){
// This function is to show the form, error messages, 
// and display/selected submitted data within their corresponding
// form control
// Refer to template.html file

    // read the submitted values back so the form is sticky
    $name   = filter_input(INPUT_POST, 'name');
    $id     = filter_input(INPUT_POST, 'studentID');
    $email  = filter_input(INPUT_POST, 'email');
    $term   = filter_input(INPUT_POST, 'term');
    $dept   = filter_input(INPUT_POST, 'department');
    $status = filter_input(INPUT_POST, 'status');
    $courses = filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Student Form</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
<div class="container my-4">
    <div class="border border-primary bg-white p-4">

        <h1 class="fw-bold mb-4">Student Form</h1>

        <?php displayErrors($errors); ?>

        <form method="POST">

            <!-- Name -->
            <div class="row mb-3 align-items-center">
                <label for="name" class="col-sm-3 col-form-label">Name</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="name" name="name"
                           placeholder="John Doe" value="<?= $name ?>">
                </div>
            </div>

            <!-- Student ID -->
            <div class="row mb-3 align-items-center">
                <label for="studentID" class="col-sm-3 col-form-label">ID</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="studentID" name="studentID"
                           placeholder="0123456789" value="<?= $id ?>">
                </div>
            </div>

            <!-- Student email -->
            <div class="row mb-3 align-items-center">
                <label for="email" class="col-sm-3 col-form-label">Email</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="email" name="email"
                           placeholder="here@there.com" value="<?= $email ?>">
                </div>
            </div>

            <!-- Term -->
            <div class="row mb-3 align-items-center">
                <label for="term" class="col-sm-3 col-form-label">Term</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="term" name="term"
                           placeholder="(Fall|Winter|Summer) 202X" value="<?= $term ?>">
                </div>
            </div>

            <!-- Department: select populated from department.csv -->
            <div class="row mb-3 align-items-center">
                <label for="department" class="col-sm-3 col-form-label">Department</label>
                <div class="col-sm-9">
                    <select class="form-select" id="department" name="department">
                        <option value="">Select one</option>
                        <?php foreach ($deptArray as $key => $value): ?>
                            <option value="<?= $key ?>"<?= stickyAttr($dept, $key, 'selected') ?>><?= $value ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <!-- Course: checkboxes populated from courses.txt -->
            <div class="row mb-3 align-items-center">
                <span class="col-sm-3 col-form-label">Course</span>
                <div class="col-sm-9">
                    <?php foreach ($courseArray as $key => $value): ?>
                        <label class="me-3">
                            <input type="checkbox" name="courses[]"
                                   value="<?= $key ?>"<?= (is_array($courses) && in_array($key, $courses)) ? ' checked' : '' ?>>
                            <?= $value ?>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Status: radio buttons -->
            <div class="row mb-3 align-items-center">
                <span class="col-sm-3 col-form-label">Status</span>
                <div class="col-sm-9">
                    <?php foreach (['domestic', 'international'] as $option): ?>
                        <label class="me-3">
                            <input type="radio" name="status"
                                   value="<?= $option ?>"<?= stickyAttr($status, $option) ?>>
                            <?= $option ?>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Submit -->
            <div class="d-grid">
                <button type="submit" class="btn btn-success btn-lg">Submit</button>
            </div>
        </form>
    </div>
</div>
</body>
</html>
<?php
}

function showData(){
// This function is to display the submitted valid data
// Refer to template2.html file    
    // re-read the validated data from the request
    $name   = filter_input(INPUT_POST, 'name');
    $id     = filter_input(INPUT_POST, 'studentID');
    $email  = filter_input(INPUT_POST, 'email');
    $term   = filter_input(INPUT_POST, 'term');
    $dept   = filter_input(INPUT_POST, 'department');
    $courses = filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
    $status  = filter_input(INPUT_POST, 'status');
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Student Form: Success</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="bg-light">
<div class="container my-4">
    <div class="border border-primary bg-white p-4">

        <h1 class="fw-bold mb-4">Student Form: Success</h1>

        <table class="table table-bordered align-middle">
            <thead class="table-dark">
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th class="fw-normal" style="width: 25%">Name</th>
                    <td><?= $name ?></td>
                </tr>
                <tr>
                    <th class="fw-normal">ID</th>
                    <td><?= $id ?></td>
                </tr>
                <tr>
                    <th class="fw-normal">Email</th>
                    <td><?= $email ?></td>
                </tr>
                <tr>
                    <th class="fw-normal">Term</th>
                    <td><?= $term ?></td>
                </tr>
                <tr>
                    <th class="fw-normal">Department</th>
                    <td><?= $dept ?></td>
                </tr>
                <tr>
                    <th class="fw-normal">Courses</th>
                    <td>
                        <?php foreach ((array) $courses as $course): ?>
                            <?= $course ?><br>
                        <?php endforeach; ?>
                    </td>
                </tr>
                <tr>
                    <th class="fw-normal">Status</th>
                    <td><?= $status ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>
<?php
}
