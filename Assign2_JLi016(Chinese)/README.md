# Assignment 2：Form Validation —— 逐文件实现指南

这份 README 按**动手顺序**讲解：每个文件要写什么代码、写在哪个位置、起什么作用。
代码已经全部写好，本指南帮你理解"为什么这么写"，也能照着它自己重做一遍。

命名约定：`abcXXX` = 姓氏前 3 位 + 学号后 3 位 = **JLi016**，所以所有文件名里都是 `JLi016`。

---

## 0. 先看全局：一次请求是怎么跑起来的

```
浏览器访问 assign2_JLi016.php
        │
        ▼
【主控制器】assign2_JLi016.php
        │  1. require 三个 inc 文件（把函数加载进来）
        │  2. 判断是不是 POST（表单被提交了？）
        │  3. 是 POST → 调用 validate() 拿错误数组
        │
        ├── 没提交，或有错误 ──→ showForm($deptArray,$courseArray,$errors=[])
        │                          （从 data 文件读选项 + 显示表单 + 显示错误）
        │
        └── 提交且零错误 ──────→ showData()
                                   （显示提交成功的数据表格）
```

三个分工：

| 文件 | 角色 | 一句话职责 |
|---|---|---|
| `assign2_JLi016.php` | 控制器（Controller） | 决定"显示表单"还是"显示成功页" |
| `inc/validate_JLi016.inc.php` | 校验（Model） | 检查输入，返回错误数组 |
| `inc/page_JLi016.inc.php` | 视图（View） | 负责输出 HTML |
| `inc/utility_JLi016.inc.php` | 工具库 | 读数据文件 → 关联数组 |
| `data/department.csv` / `data/courses.txt` | 数据 | 下拉框 / 复选框的选项来源 |

> 关键点：**表单和成功页不能同时显示**，由控制器二选一；错误信息和已填数据都通过参数传进 `showForm()`。

---

## 1. 目录结构与数据文件

### 步骤 1.1：建立文件夹

```
Assign2_JLi016/
├── assign2_JLi016.php
├── data/
│   ├── department.csv
│   └── courses.txt
└── inc/
    ├── page_JLi016.inc.php
    ├── validate_JLi016.inc.php
    └── utility_JLi016.inc.php
```

### 步骤 1.2：写数据文件（`data/department.csv`）

**要写什么**：每行一组 `键,值`（逗号分隔），键是提交给服务器的值，值是屏幕上显示的文字。

```csv
mar,Marketing
csis,Computing Science and Information Systems
bus,Business Administration
acc,Accounting
fin,Finance
```

**作用**：下拉框的选项**必须**来自这个文件（作业要求 4），不能写死在 HTML 里。
提交时表单发送的是 `mar`，成功页显示 `mar`；下拉框里用户看到的是 `Marketing`。

### 步骤 1.3：写数据文件（`data/courses.txt`）

```txt
csis-1175,CSIS-1175
csis-2200,CSIS-2200
csis-1190,CSIS-1190
```

**作用**：复选框选项来源（作业要求 5）。两个文件格式完全一致，所以可以**用同一个函数读取**。

---

## 2. inc/utility_JLi016.inc.php —— 读取数据文件

**要写什么**：一个 `readData($fileName)` 函数。

```php
function readData($fileName){
// This function is to read data file and return 
// the key/value pairs to be used by some form controls    
    $pairs = [];
    $path = __DIR__ . '/../data/' . $fileName;   // inc 的上级目录里的 data 文件夹

    if (!file_exists($path) || !is_readable($path)) {
        return $pairs; // 文件缺失 -> 返回空数组
    }

    $handle = fopen($path, 'r');
    while (($row = fgetcsv($handle)) !== false) { // fgetcsv：读一行并按逗号拆分
        if (count($row) >= 2) {
            $pairs[trim($row[0])] = trim($row[1]); // key => value
        }
    }
    fclose($handle);
    return $pairs;
}
```

**作用 / 为什么**
- 作业要求"把文件内容读成 key/value 数组"，这个函数就是干这个的。
- 返回一个**关联数组**：`['mar' => 'Marketing', 'csis' => 'Computing Science...']`。
- `department.csv` 和 `courses.txt` 格式相同 → 一个函数通吃，不用写两遍。
- `__DIR__` 而不是相对路径 `'../data/'`：避免"当前工作目录"变化导致找不到文件（**常见坑**）。
- 文件不存在时返回空数组，页面不会崩。

**检查点**：临时打印 `print_r(readData('department.csv'));` 能看到 5 组键值对。

---

## 3. inc/page_JLi016.inc.php（第一部分）—— showForm() 显示表单

这是工作量最大的文件。它必须包含**两个规定函数**（签名不能改）：

```php
function showForm($deptArray,$courseArray,$errors=[])  // 显示表单
function showData()                                     // 显示成功页
```

外加**最多两个自定义辅助函数**（作业明确限制 ≤ 2 个），本项目用了：

```php
function displayErrors(array $errors): void   // 辅助1：循环输出错误
function stickyAttr($submitted, string $optionValue, string $attribute = 'checked'): string // 辅助2：粘性属性
```

### 步骤 3.1：辅助函数 1 —— displayErrors()

**写在哪里**：`showForm()` 之前。
**作用**：把错误数组循环显示成红色框，符合"用循环显示错误信息"的要求。

```php
function displayErrors(array $errors): void
{
    if (empty($errors)) return;      // 首次访问没有错误，直接返回
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
```

### 步骤 3.2：辅助函数 2 —— stickyAttr()

**作用**：让"已选的值"在重新显示表单时仍处于选中/勾选状态（作业要求：selected/chosen data 要显示为 selected 或 checked）。

```php
function stickyAttr($submitted, string $optionValue, string $attribute = 'checked'): string
{
    return ($submitted !== null && $submitted === $optionValue) ? ' ' . $attribute : '';
}
```

用法：
- 下拉框：`<?= stickyAttr($dept, $key, 'selected') ?>` → 输出 ` selected`
- 单选框：`<?= stickyAttr($status, $option) ?>` → 输出 ` checked`

一个函数通吃两种属性，这是只写 2 个辅助函数还能保持简洁的技巧。

### 步骤 3.3：showForm() 开头 —— 取回已提交的值（粘性表单）

```php
function showForm($deptArray,$courseArray,$errors=[])
{
    $name   = filter_input(INPUT_POST, 'name');
    $id     = filter_input(INPUT_POST, 'studentID');
    $email  = filter_input(INPUT_POST, 'email');
    $term   = filter_input(INPUT_POST, 'term');
    $dept   = filter_input(INPUT_POST, 'department');
    $status = filter_input(INPUT_POST, 'status');
    ?><!doctype html> ...
```

**作用**：把这些值回填到 `value="..."` 里，用户提交失败后不用重新输入（作业要求"Submitted data will be displayed on the corresponding form input control"）。
**为什么在 showForm 里读**：函数签名固定为 `showForm($deptArray,$courseArray,$errors=[])`，不能加参数，所以文本类粘性值要在函数内部自己从 POST 读。

### 步骤 3.4：showForm() 里 —— 错误区与文本框

```php
<?php displayErrors($errors); ?>          <!-- 有错才显示红色框 -->
<input ... name="name"  value="<?= $name ?>">
<input ... name="studentID" value="<?= $id ?>">
<input ... name="email" value="<?= $email ?>">
<input ... name="term"  value="<?= $term ?>">
```

### 步骤 3.5：showForm() 里 —— 下拉框（来自 department.csv）

```php
<select class="form-select" id="department" name="department">
    <option value="">Select one</option>
    <?php foreach ($deptArray as $key => $value): ?>
        <option value="<?= $key ?>"<?= stickyAttr($dept, $key, 'selected') ?>><?= $value ?></option>
    <?php endforeach; ?>
</select>
```

**作用**：选项由 `$deptArray`（数据文件读出）循环生成；`option value` 用键、`option` 文字用值；已选项加 `selected`。

### 步骤 3.6：showForm() 里 —— 复选框（来自 courses.txt）

```php
<?php $courses = filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY); ?>
<?php foreach ($courseArray as $key => $value): ?>
    <label class="me-3">
        <input type="checkbox" name="courses[]" value="<?= $key ?>"
               <?= (is_array($courses) && in_array($key, $courses)) ? ' checked' : '' ?>>
        <?= $value ?>
    </label>
<?php endforeach; ?>
```

**作用**：`name="courses[]"` 的方括号让 PHP 收到数组；循环生成选项；用 `in_array()` 判断是否要打勾。

⚠️ **易错点**：`FILTER_REQUIRE_ARRAY` 是**标志位**，不是过滤器 ID，必须放在 `filter_input` 的**第 4 个参数**：

```php
filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);  // ✅
filter_input(INPUT_POST, 'courses', FILTER_REQUIRE_ARRAY);                  // ❌ 读不到数组
```

### 步骤 3.7：showForm() 里 —— 单选框与提交按钮

```php
<?php foreach (['domestic', 'international'] as $option): ?>
    <label><input type="radio" name="status" value="<?= $option ?>"<?= stickyAttr($status, $option) ?>> <?= $option ?></label>
<?php endforeach; ?>

<button type="submit" class="btn btn-success btn-lg">Submit</button>
```

`<form method="POST">` **不写 action** → 提交回本页自己（postback），控制器才能用 `REQUEST_METHOD === 'POST'` 判断提交。

---

## 4. inc/validate_JLi016.inc.php —— validate() 校验

**要写什么**：固定签名 `function validate()`，返回**关联数组**：`[ 输入名 => 错误信息 ]`。
这种设计的好处：`showForm()` 能按输入名定位错误；`empty($errors)` 就是"全部通过"。

文件顶部先 require 工具库（校验 department/courses 时要比对合法值）：

```php
require_once __DIR__ . '/utility_JLi016.inc.php';
```

### 步骤 4.1：姓名（要求 6a）

```php
$name = filter_input(INPUT_POST, 'name');
if (empty($name)) {
    $errors['name'] = 'Please enter your fullname';
} elseif (!preg_match("/^[a-zA-Z' -]+$/", $name)) {   // 无数字、无特殊字符
    $errors['name'] = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
} elseif (str_word_count($name) < 2) {                 // 必须有名 + 姓
    $errors['name'] = 'Please enter both your first and last name.';
}
```

**顺序有讲究**：三条是 `if / elseif / elseif`，一次只报一条。姓名的字符检查要放在"姓+名"检查**之前**，这样输入 `John24` 时报的是字符错误（与作业截图一致）。

### 步骤 4.2：学号（要求 6b，十位数）

```php
$pattern = [ "options" => [ "regexp" => "/^\d{10}$/" ]];
$id = filter_input(INPUT_POST, 'studentID', FILTER_VALIDATE_REGEXP, $pattern);
if (empty($id)) $errors['studentID'] = 'ID should be ten digit number';
```

`FILTER_VALIDATE_REGEXP` 作为**第 3 个参数**（过滤常量），正则放在第 4 个参数的 `options.regexp`。
验证失败返回 `false`、字段不存在返回 `null`，`empty()` 一次性覆盖两种情况。

### 步骤 4.3：邮箱（要求 6c）

```php
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if (empty($email)) $errors['email'] = 'Please enter the correct email address';
```

### 步骤 4.4：学期（要求 6d）

```php
$pattern = ["options" => ["regexp" => "/^(Winter|Summer|Fall) 202[0-6]$/"]];
$term = filter_input(INPUT_POST, 'term', FILTER_VALIDATE_REGEXP, $pattern);
if (empty($term)) $errors['term'] = 'Please enter the correct term between Winter 2020 until Fall 2026';
```

正则含义：`Winter|Summer|Fall` + 一个空格 + `202` + `0~6` → 例如 `Fall 2024` 通过，`Winter 2027` 不通过。

### 步骤 4.5：部门（要求 6e，必须是合法选项之一）

```php
$dept      = filter_input(INPUT_POST, 'department');
$deptArray = readData('department.csv');
if (empty($dept) || !array_key_exists($dept, $deptArray)) {
    $errors['department'] = 'Please select one of the departments';
}
```

**作用**：防止用户伪造 POST 提交不存在的部门值——用 `array_key_exists()` 比对数据文件的键。

### 步骤 4.6：课程（要求 6f，至少选一个且值合法）

```php
$courses = filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
$courseArray = readData('courses.txt');
if (empty($courses)) {
    $errors['courses'] = 'Please select one of the courses';
} else {
    foreach ($courses as $course) {
        if (!array_key_exists($course, $courseArray)) {  // 逐个检查合法性
            $errors['courses'] = 'Please select one of the courses';
            break;
        }
    }
}
```

### 步骤 4.7：身份（要求 6g）

```php
$status = filter_input(INPUT_POST, 'status');
if (empty($status) || !in_array($status, ['domestic', 'international'])) {
    $errors['status'] = 'Please select one of the statuses';
}
```

### 步骤 4.8：最后别忘了

```php
return $errors;   // 空数组 = 全部通过
```

---

## 5. inc/page_JLi016.inc.php（第二部分）—— showData() 成功页

**要写什么**：固定签名 `function showData()`，全部有效时显示提交的数据，用循环简化代码。

```php
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
    <table class="table table-bordered align-middle">
      <thead class="table-dark"><tr><th>Field</th><th>Value</th></tr></thead>
      <tbody>
        <tr><th class="fw-normal">Name</th><td><?= $name ?></td></tr>
        <tr><th class="fw-normal">ID</th><td><?= $id ?></td></tr>
        <tr><th class="fw-normal">Email</th><td><?= $email ?></td></tr>
        <tr><th class="fw-normal">Term</th><td><?= $term ?></td></tr>
        <tr><th class="fw-normal">Department</th><td><?= $dept ?></td></tr>
        <tr><th class="fw-normal">Courses</th>
            <td><?php foreach ((array) $courses as $course): ?><?= $course ?><br><?php endforeach; ?></td></tr>
        <tr><th class="fw-normal">Status</th><td><?= $status ?></td></tr>
      </tbody>
    </table>
    <?php
}
```

**作用**：把 7 项数据用一张 `Field / Value` 表格展示（对应 `template2.html`）。
标量字段放进 `$data` 数组用**一个 `foreach`** 输出，课程用第二个循环逐行显示——符合"用循环简化代码"的要求。

---

## 6. assign2_JLi016.php —— 主控制器，把一切串起来

只有这一个主文件（作业限制），内容其实很短：

```php
<?php
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
```

**作用说明**
- `$_SERVER['REQUEST_METHOD'] === 'POST'` 区分"第一次打开"和"点了提交"（postback 模式）。
- 只有**提交且无错**才显示成功页；首次访问也走 `showForm()`（此时 `$errors` 为空，不显示错误框）。
- 数据文件在顶部按老师要求的顺序一次性读取（`read all data files`），`showForm` 直接复用这两个数组。
- 每个文件顶部都要有姓名/学号注释（作业要求 1）。

---

## 7. 运行与自测清单

```bash
cd "/Users/johnnylin/Library/CloudStorage/OneDrive-Personal/3280-Backend Web Development/Assign2_JLi016"
php -S localhost:8000
```

浏览器打开 <http://localhost:8000/assign2_JLi016.php>（终端窗口保持开启，`Ctrl + C` 停止）。

按顺序验证（对应作业截图的 7 张图）：

| # | 操作 | 期望结果 |
|---|---|---|
| 1 | 首次打开 | 只有空表单，无错误框；下拉框 5 项、复选框 3 项 |
| 2 | 什么都不填直接提交 | 红色框列出 7 条错误 |
| 3 | Name 填 `John` | 报 `Please enter both your first and last name.` |
| 4 | Name 填 `John24` | 报 `Name can only contain letters...` |
| 5 | Name 填 `John Doe`，其余留空 | 姓名不再报错，其余 6 条仍在 |
| 6 | 填错邮箱 / 填 `Fall` | 分别报邮箱错误 和 学期错误 |
| 7 | 全部合法（`John Douglas` / `1122334455` / `john@data.com` / `Fall 2024` / `mar` / 勾两门课 / `international`） | 显示 Success 表格：Name、ID、Email、Term、Department=mar、Courses 两行、Status=international |

补充验证粘性表单：故意填错一项再提交 → 已填的文字还在、已选的部门和单选框仍选中、勾过的课程仍打勾。

命令行语法检查（四个文件都应输出 No syntax errors）：

```bash
php -l assign2_JLi016.php
php -l inc/page_JLi016.inc.php
php -l inc/validate_JLi016.inc.php
php -l inc/utility_JLi016.inc.php
```

---

## 8. 易错点清单（本人在实现时踩过）

1. **`inc` 文件第一行必须是 `<?php`**：把文件头注释写在 `<?php` **之前**，PHP 不会解析它，注释会被当成纯文本输出到页面，同时函数未定义导致 `Call to undefined function` 致命错误。
2. **`FILTER_REQUIRE_ARRAY` 放第 4 个参数**（见 3.6），放第 3 个读不到数组。
3. **include 路径用 `__DIR__`**：`require_once __DIR__ . '/utility_...inc.php'`，比相对路径稳。
4. **服务器要在项目目录启动**，否则 URL 对不上；路径含空格要加引号。
5. **`empty('0')` 为 true**（week04 的坑）：本作业学号必须是 10 位，不涉及 0，但如果价格/数量类字段要判空，记得先排除 `'0'`。
6. **`elseif` 而非多个 `if`**：同一字段一次只显示一条错误，避免 `John24` 同时报两条。
7. **提交前替换文件头的姓名和学号**（当前是 `J. Li` / `XXXXXX016` 占位）。
