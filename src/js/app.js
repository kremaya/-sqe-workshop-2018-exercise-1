import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {createArray,createTable} from './table-creator';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));   
        let arr=createArray(parsedCode);
        let rows=createTable(arr);
        document.getElementById('output').innerHTML=rows;


    });
});

