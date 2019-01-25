// ==UserScript==
// @id              SECopyQuestionAsMD
// @name            SECopyQuestionAsMD
// @namespace       https://www.github.com/teocci/SECopyQuestionAsMD
// @description     Replaces Ask Question buttons form the Question Header on stackexchange, askubuntu and superuser platforms with a copy link.
// @version         1.0.3
// @author          Teocci <teocci@yandex.com>
// @domain          stackexchange.com
// @domain          askubuntu.com
// @domain          superuser.com
// @match           http://*.stackexchange.com/*
// @match           https://*.stackexchange.com/*
// @match           http://*.askubuntu.com/*
// @match           https://*.askubuntu.com/*
// @match           http://*.superuser.com/*
// @match           https://*.superuser.com/*
// @match           http://*serverfault.com/*
// @match           https://*serverfault.com/*
// @include         http://*.stackexchange.com/*
// @include         https://*.stackexchange.com/*
// @include         http://*.askubuntu.com/*
// @include         https://*.askubuntu.com/*
// @include         http://*.superuser.com/*
// @include         https://*.superuser.com/*
// @include         http://*serverfault.com/*
// @include         https://*serverfault.com/*
// @grant           none
// @updateURL       https://raw.githubusercontent.com/teocci/SOAskQuestionRemover/master/dist/SECopyQuestionAsMD.meta.js
// @downloadURL     https://raw.githubusercontent.com/teocci/SOAskQuestionRemover/master/dist/SECopyQuestionAsMD.user.js
// @run-at          document-start
// @updateVersion   01
// @priority        9001
// @license         MIT
// ==/UserScript==

(function () {
    'use strict';

    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    NodeList.prototype.forEach = Array.prototype.forEach;

    document.addEventListener('DOMContentLoaded', function () {

        var questionHeader = document.getElementById('question-header');

        function copyTextToClipboard(text) {
            var textArea = document.createElement("textarea");
            //
            // *** This styling is an extra step which is likely not required. ***
            //
            // Why is it here? To ensure:
            // 1. the element is able to have focus and selection.
            // 2. if element was to flash render it has minimal visual impact.
            // 3. less flakyness with selection and copying which **might** occur if
            //    the textarea element is not visible.
            //
            // The likelihood is the element won't even render, not even a flash,
            // so some of these are just precautions. However in IE the element
            // is visible whilst the popup box asking the user for permission for
            // the web page to copy to the clipboard.
            //

            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;

            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';

            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = 0;

            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';

            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';


            textArea.value = text;

            document.body.appendChild(textArea);

            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }

            document.body.removeChild(textArea);
        }

        if (questionHeader) {
            var askQuestion = questionHeader.querySelector('div > a');
            if (askQuestion) {
                var parent = askQuestion.parentElement;
                if (parent) {
                    console.log(parent.nodeName)
                    // console.log(element);
                    // questionButton.innerHTML = '<a class="btn">Copy Question</a>';
                    var aTag = document.createElement('a');
                    aTag.setAttribute('class', 'btn');
                    aTag.innerHTML = 'Copy Question';
                    aTag.removeAttribute('href');
                    aTag.addEventListener('click', function () {
                        var questionLinks = questionHeader.getElementsByClassName('question-hyperlink');
                        if (questionLinks) {
                            var questionText = questionLinks[0].innerHTML;
                            var questionLink = questionLinks[0].href;
                            var arrayLink = questionLink.split('/');
                            var newQuestionLink = '';
                            arrayLink.splice(-1, 1);
                            arrayLink.forEach(function (element) {
                                if (element) {
                                    if (newQuestionLink) {
                                        newQuestionLink += '/' + element;
                                    } else {
                                        newQuestionLink = element + '/';
                                    }
                                }
                            });
                            copyTextToClipboard('* [' + questionText + '](' + newQuestionLink + ')');
                        }
                    });
                    parent.removeChild(askQuestion);
                    parent.appendChild(aTag);
                }
            }
        }
        console.log('SECopyQuestionAsMD executed');
    });
    console.log('SECopyQuestionAsMD loaded');
})();