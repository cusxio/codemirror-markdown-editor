var angular = require('angular');
var CodeMirror = require('codemirror');
var hljs = require('highlight.js');
var gfm = require('jspm_packages/npm/codemirror@5.6.0/mode/gfm/gfm.js');
var closebrackets = require('jspm_packages/npm/codemirror@5.6.0/addon/edit/closebrackets.js');
var mm = require('meta-marked');
var emojify = require('emojify.js');

var app = angular.module('cm', []);

emojify.setConfig({
    img_dir          : 'https://raw.githubusercontent.com/hassankhan/emojify.js/c9568789ee1602b3beccca9f4e43b5c4b2b9a882/images/emoji' 
});

app.controller('ctrl', function($scope) {
    $scope.my_markdown = "# Codemirror Markdown Editor\n\n> Built with Angular JS Custom Directive !\n\n# Feature\n- GitHub Flavored Preview\n- Emoji Support !! :smile: :+1:\n\n# Built with\n\n- **[marked](https://github.com/chjj/marked)** for Parsing Markdown\n- **[emoji](http://hassankhan.me/emojify.js/)** for emoji's ! :kissing_heart: :scream: :speech_balloon:\n- **[highlight-js](https://github.com/isagalaev/highlight.js)** for code highlighting\n- **[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)** for beautifying markdown output\n- **[highlight-js css](https://github.com/isagalaev/highlight.js/tree/master/src/styles)** for beautifying code output\n\n\n# Examples\n* Javascript\n\n```javascript\nfunction() { \n  console.log('This is awesome!');\n}\n```\n\n* Bash\n\n```bash\n# step 1\nnpm install\n```\netc..\n\n# The End\n- Enjoy ~";
});

app.directive('codeEditor', function($timeout) {
    return {
        restrict: 'E',
        require: "?ngModel",
        replace: true,
        transclude: true,
        theme: 'base16-light',
        template: '<div class="code-editor"></div>',
        link: function(scope, element, attrs, ngModelCtrl, transclude) {
            scope.editor = CodeMirror(element[0], {
                mode: 'gfm',
                autoCloseBrackets: true,
                lineWrapping: true,
                lineNumbers: true,
                matchBrackets: true,
                theme: 'base16-light',
                extraKeys: {
                    "Enter": "newlineAndIndentContinueMarkdownList"
                }
            });
            if (ngModelCtrl) {
                ngModelCtrl.$render = function() {
                    scope.editor.setValue(ngModelCtrl.$viewValue);
                };
            }
            scope.editor.on('change', function() {
                ngModelCtrl.$setViewValue(scope.editor.getValue());
                scope.$emit('editor-change');
            });
        }
    };
});

app.directive("markdownViewer", [function() {
    mm.setOptions({
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });
    return {
        link: function(scope, element, attrs) {
            scope.$on('editor-change', function() {
                element.html(mm(scope.editor.getValue()).html);
                emojify.run();
            });
        }
    };
}]);
