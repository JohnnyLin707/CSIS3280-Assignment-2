/* Assignment 2 练习网页 —— 交互逻辑
 * - 代码填空 / 选择题 / 自测清单
 * - 进度保存在 localStorage
 */
(function () {
  'use strict';

  var STORE_KEY = 'csis3280-a2-practice-v1';

  /* ============ 代码填空 ============ */
  var DRILLS = [
    {
      id: 'd1',
      title: 'readData() 里拼接数据文件的路径（inc 的上级目录里的 data 文件夹）',
      code: "$path = __DIR__ . '/______/' . $fileName;",
      answer: '../data',
      hint: '从 inc/ 出发，先回上级目录，再进 data 文件夹。'
    },
    {
      id: 'd2',
      title: '一次读一行、并按逗号拆成数组的函数',
      code: 'while (($row = ______($handle)) !== false) {',
      answer: 'fgetcsv',
      hint: 'csv = comma separated values，函数名以 f 开头。'
    },
    {
      id: 'd3',
      title: '读取复选框数组 courses[] 时，filter_input 的第 4 个参数',
      code: "$courses = filter_input(INPUT_POST, 'courses', FILTER_DEFAULT, ____________________);",
      answer: 'FILTER_REQUIRE_ARRAY',
      hint: '它是"标志位"而不是过滤器 ID，所以不能放第 3 个参数。'
    },
    {
      id: 'd4',
      title: '学号必须是 10 位数字 —— 补全正则',
      code: '$pattern = ["options" => ["regexp" => "/^______$/"]];',
      answer: '\\d{10}',
      hint: '\\d 表示数字，{10} 表示重复 10 次。'
    },
    {
      id: 'd5',
      title: '控制器里判断"表单是否被提交"要读 $_SERVER 的哪个键',
      code: "$isSubmitted = ($_SERVER['______________'] === 'POST');",
      answer: 'REQUEST_METHOD',
      hint: '直译就是"请求方法"。'
    },
    {
      id: 'd6',
      title: '判断提交的部门值必须是数据文件里已有的键',
      code: 'if (empty($dept) || !________________($dept, $deptArray)) {',
      answer: 'array_key_exists',
      hint: '不是 in_array —— 要看的是"键"，不是"值"。'
    },
    {
      id: 'd7',
      title: '校验邮箱格式要用哪个过滤器常量',
      code: "$email = filter_input(INPUT_POST, 'email', ____________________);",
      answer: 'FILTER_VALIDATE_EMAIL',
      hint: '放在 filter_input 的第 3 个参数。'
    },
    {
      id: 'd8',
      title: '复选框的 name 要怎么写，PHP 才会收到数组',
      code: '<input type="checkbox" name="courses_____" value="<?= $key ?>">',
      answer: '[]',
      hint: '两个字符，方括号。'
    },
    {
      id: 'd9',
      title: '学期正则：Winter/Summer/Fall + 空格 + 2020~2026',
      code: '$pattern = ["options" => ["regexp" => "/^(Winter|Summer|Fall) ______$/"]];',
      answer: '202[0-6]',
      hint: '年份前三位固定是 202，最后一位 0~6。'
    },
    {
      id: 'd10',
      title: '控制器里"提交成功且没有错误"才显示成功页',
      code: 'if ($isSubmitted && ______($errors)) {\n    showData();',
      answer: 'empty',
      hint: '错误数组是空的就代表全部通过。'
    }
  ];

  /* ============ 选择题 ============ */
  var QUIZ = [
    {
      id: 'q1',
      q: '表单写成 <form method="POST">（不写 action）时会怎样？',
      options: ['提交回当前页面自己（postback）', '提交到网站根目录', '什么都不发生', '报 404'],
      answer: 0,
      explain: '不写 action 就是提交回本页，控制器才能用 $_SERVER[\'REQUEST_METHOD\'] === \'POST\' 区分"首次打开"和"点了提交"。'
    },
    {
      id: 'q2',
      q: 'FILTER_REQUIRE_ARRAY 应该作为 filter_input() 的第几个参数？',
      options: ['第 2 个', '第 3 个（过滤器 ID）', '第 4 个（options / flags）', '第 5 个'],
      answer: 2,
      explain: 'filter_input(类型, 变量名, 过滤器, 选项)。它是标志位不是过滤器，放第 3 个就读不到数组。'
    },
    {
      id: 'q3',
      q: '为什么在 inc 文件里用 require_once __DIR__ . \'/utility_...inc.php\'？',
      options: ['运行更快', '不受"当前工作目录"影响，路径永远相对于该文件', 'PHP 语法强制要求', '为了支持 HTTPS'],
      answer: 1,
      explain: '相对路径会跟着"当前工作目录"变，__DIR__ 永远是当前文件所在目录，最稳。'
    },
    {
      id: 'q4',
      q: 'validate() 的返回值是怎么设计的？',
      options: ['布尔值 true / false', '一个拼接好的错误字符串', '索引数组', '关联数组：[输入名 => 错误信息]'],
      answer: 3,
      explain: '用输入名做键，视图可以按字段定位错误；empty($errors) 就代表全部通过。'
    },
    {
      id: 'q5',
      q: '姓名校验用 if / elseif / elseif 链，而不是多个独立 if，目的是？',
      options: ['提高运行速度', '同一字段一次只显示一条错误', '减少缩进', '让正则更简洁'],
      answer: 1,
      explain: '输入 John24 时只报"字符错误"，不会同时报"缺姓"，与作业截图一致。'
    },
    {
      id: 'q6',
      q: '下拉框和复选框的选项必须来自哪里？',
      options: ['直接写死在 HTML 里', 'JavaScript 数组', '数据库', 'data/ 下的数据文件'],
      answer: 3,
      explain: '作业要求选项由数据文件读出（department.csv / courses.txt），不能写死。'
    },
    {
      id: 'q7',
      q: 'stickyAttr() 这类辅助函数的作用是什么？',
      options: ['输出 required 属性', '防止 XSS', '让已提交的值在重显表单时保持 selected / checked', '生成 CSRF token'],
      answer: 2,
      explain: '这就是"粘性表单"：提交失败后用户已填的内容、已选的选项都还在。'
    },
    {
      id: 'q8',
      q: '主控制器在什么条件下调用 showData()？',
      options: ['只要是 POST 就调用', '首次访问时调用', '是 POST 且 $errors 为空', '是 GET 时调用'],
      answer: 2,
      explain: '表单页和成功页二选一；提交且有错时仍回到 showForm() 并把错误传进去。'
    },
    {
      id: 'q9',
      q: '成品的 department.csv 为什么删掉了 ",Select one" 这一行？',
      options: ['CSV 不允许空字段', '会导致 fgetcsv 报错', '老师要求必须有表头', '读进数组会变成空键，"Select one" 更适合直接写在 HTML 的 option 里'],
      answer: 3,
      explain: "空键既不能当合法选项，也让校验变麻烦；占位提示写成 <option value=\"\">Select one</option> 更干净。"
    },
    {
      id: 'q10',
      q: 'inc 文件的第一行必须是什么？',
      options: ['姓名学号注释', 'require_once', '<!doctype html>', '<?php'],
      answer: 3,
      explain: '注释写在 <?php 之前会被当成纯文本输出到页面，还会导致函数未定义的致命错误。注释要写在 <?php 里面。'
    }
  ];

  /* ============ 状态 ============ */
  var state = { drills: {}, quiz: {}, checks: {} };

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        state.drills = s.drills || {};
        state.quiz = s.quiz || {};
        state.checks = s.checks || {};
      }
    } catch (e) { /* 忽略（file:// 或隐私模式） */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function norm(v) {
    return String(v).replace(/['"`;]/g, '').replace(/\s+/g, '').toLowerCase();
  }

  /* ============ 渲染：填空 ============ */
  function renderDrills() {
    var wrap = document.getElementById('drill-list');
    if (!wrap) return;

    DRILLS.forEach(function (d, i) {
      var card = document.createElement('div');
      card.className = 'drill';

      var head = document.createElement('div');
      head.className = 'drill-head';
      var pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = '填空 ' + (i + 1);
      var title = document.createElement('span');
      title.className = 'drill-title';
      title.textContent = d.title;
      head.appendChild(pill);
      head.appendChild(title);

      var block = document.createElement('div');
      block.className = 'code-block';
      var chead = document.createElement('div');
      chead.className = 'code-head';
      var lang = document.createElement('span');
      lang.className = 'code-lang';
      lang.textContent = 'php';
      chead.appendChild(lang);
      var pre = document.createElement('pre');
      var codeEl = document.createElement('code');
      d.code.split('______').forEach(function (part, idx) {
        if (idx > 0) {
          var blank = document.createElement('span');
          blank.className = 'blank';
          blank.textContent = '______';
          codeEl.appendChild(blank);
        }
        codeEl.appendChild(document.createTextNode(part));
      });
      pre.appendChild(codeEl);
      block.appendChild(chead);
      block.appendChild(pre);

      var form = document.createElement('div');
      form.className = 'drill-form';
      var input = document.createElement('input');
      input.className = 'drill-input';
      input.type = 'text';
      input.spellcheck = false;
      input.autocomplete = 'off';
      input.placeholder = '填入缺失的代码';
      var btn = document.createElement('button');
      btn.className = 'btn';
      btn.type = 'button';
      btn.textContent = '检查';
      var btnShow = document.createElement('button');
      btnShow.className = 'btn ghost';
      btnShow.type = 'button';
      btnShow.textContent = '看答案';
      form.appendChild(input);
      form.appendChild(btn);
      form.appendChild(btnShow);

      var fb = document.createElement('div');
      fb.className = 'feedback';
      var hint = document.createElement('div');
      hint.className = 'hint';
      hint.textContent = '提示：' + d.hint;

      btn.addEventListener('click', function () {
        var val = norm(input.value);
        if (val === '') {
          fb.className = 'feedback bad';
          fb.textContent = '先写一个答案再检查。';
          return;
        }
        if (val === norm(d.answer)) {
          input.classList.remove('bad');
          input.classList.add('ok');
          fb.className = 'feedback ok';
          fb.textContent = '✓ 正确！';
          state.drills[d.id] = true;
        } else {
          input.classList.remove('ok');
          input.classList.add('bad');
          fb.className = 'feedback bad';
          fb.textContent = '✗ 还不对，再想想（或点"看答案"）。';
          delete state.drills[d.id];
        }
        save();
        updateProgress();
      });

      btnShow.addEventListener('click', function () {
        input.value = d.answer;
        input.classList.remove('ok');
        fb.className = 'feedback';
        fb.innerHTML = '正确答案：<code>' + d.answer + '</code>（自己填对一遍才算掌握）';
      });

      input.addEventListener('input', function () {
        input.classList.remove('ok', 'bad');
      });

      card.appendChild(head);
      card.appendChild(block);
      card.appendChild(form);
      card.appendChild(fb);
      card.appendChild(hint);

      // 恢复已保存的正确状态
      if (state.drills[d.id]) {
        input.value = d.answer;
        input.classList.add('ok');
        fb.className = 'feedback ok';
        fb.textContent = '✓ 这道题之前已经做对了。';
      }

      wrap.appendChild(card);
    });
  }

  /* ============ 渲染：选择题 ============ */
  function renderQuiz() {
    var wrap = document.getElementById('quiz-list');
    if (!wrap) return;

    QUIZ.forEach(function (q, i) {
      var card = document.createElement('div');
      card.className = 'quiz';

      var head = document.createElement('div');
      head.className = 'drill-head';
      var pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = '第 ' + (i + 1) + ' 题';
      var qt = document.createElement('span');
      qt.className = 'drill-title';
      qt.textContent = q.q;
      head.appendChild(pill);
      head.appendChild(qt);

      var opts = document.createElement('div');
      opts.className = 'opts';
      var ex = document.createElement('div');
      ex.className = 'explain';
      ex.textContent = '解析：' + q.explain;

      function mark(chosen) {
        var correct = chosen === q.answer;
        Array.prototype.forEach.call(opts.children, function (b, idx) {
          b.disabled = true;
          if (idx === q.answer) b.classList.add('correct');
          else if (idx === chosen) b.classList.add('wrong');
        });
        ex.classList.add('show');
        state.quiz[q.id] = correct ? 'ok' : chosen;
        save();
        updateProgress();
      }

      q.options.forEach(function (text, idx) {
        var b = document.createElement('button');
        b.className = 'opt';
        b.type = 'button';
        b.textContent = text;
        b.addEventListener('click', function () { mark(idx); });
        opts.appendChild(b);
      });

      card.appendChild(head);
      card.appendChild(opts);
      card.appendChild(ex);

      // 恢复已保存的作答
      var saved = state.quiz[q.id];
      if (saved !== undefined) {
        var chosen = saved === 'ok' ? q.answer : saved;
        Array.prototype.forEach.call(opts.children, function (b, idx) {
          b.disabled = true;
          if (idx === q.answer) b.classList.add('correct');
          else if (idx === chosen) b.classList.add('wrong');
        });
        ex.classList.add('show');
      }

      wrap.appendChild(card);
    });
  }

  /* ============ 自测清单 ============ */
  function initChecklist() {
    var nodes = document.querySelectorAll('#check-list input[data-check]');
    Array.prototype.forEach.call(nodes, function (cb) {
      var id = cb.getAttribute('data-check');
      if (state.checks[id]) {
        cb.checked = true;
        cb.closest('li').classList.add('done');
      }
      cb.addEventListener('change', function () {
        if (cb.checked) {
          state.checks[id] = true;
          cb.closest('li').classList.add('done');
        } else {
          delete state.checks[id];
          cb.closest('li').classList.remove('done');
        }
        save();
        updateProgress();
      });
    });
  }

  /* ============ 进度 ============ */
  function updateProgress() {
    var total = DRILLS.length + QUIZ.length + document.querySelectorAll('#check-list input[data-check]').length;
    var done = 0;
    DRILLS.forEach(function (d) { if (state.drills[d.id]) done++; });
    QUIZ.forEach(function (q) { if (state.quiz[q.id] === 'ok') done++; });
    Array.prototype.forEach.call(document.querySelectorAll('#check-list input[data-check]'), function (cb) {
      if (cb.checked) done++;
    });

    var pct = total ? Math.round(done / total * 100) : 0;
    var bar = document.getElementById('progress-bar');
    var txt = document.getElementById('progress-text');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = done + ' / ' + total + '（' + pct + '%）';
  }

  /* ============ 目录高亮 ============ */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.sidebar a'));
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });

    function onScroll() {
      var pos = window.scrollY + 140;
      var current = 0;
      sections.forEach(function (sec, i) {
        if (sec && sec.offsetTop <= pos) current = i;
      });
      links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============ 复制按钮 ============ */
  function initCopyButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('.code-block'), function (block) {
      var head = block.querySelector('.code-head');
      var code = block.querySelector('pre code');
      if (!head || !code || head.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = '复制';
      btn.addEventListener('click', function () {
        var text = code.textContent;
        var done = function () {
          btn.textContent = '已复制';
          setTimeout(function () { btn.textContent = '复制'; }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
      head.appendChild(btn);
    });
  }

  /* ============ 重置 ============ */
  function initReset() {
    var btn = document.getElementById('reset-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!window.confirm('清空所有填空、选择题和清单的进度？')) return;
      state = { drills: {}, quiz: {}, checks: {} };
      save();
      location.reload();
    });
  }

  /* ============ 启动 ============ */
  load();
  renderDrills();
  renderQuiz();
  initChecklist();
  initCopyButtons();
  initScrollSpy();
  initReset();
  updateProgress();
})();
