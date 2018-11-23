import assert from 'assert';
import { parseCode } from '../src/js/code-analyzer';
import { createArray, createTable } from '../src/js/table-creator';

describe('Test Empty Input', () => {
    it('is processing empty input correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode(''))),
            JSON.stringify([])
        );
    });

});

describe('Test Declerations', () => {
    it('is processing decleration+init correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let i=1;'))),
            JSON.stringify([{ "Line": 1, "Type": "Variable Declaration", "Name": "i", "Condition": null, "Value": "1" }])
        );
    });

    it('is processing simple decleration correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let i;'))),
            JSON.stringify([{ "Line": 1, "Type": "Variable Declaration", "Name": "i", "Condition": null, "Value": null }])
        );
    });

    it('is processing complex variable decleration correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('let i=x;\nlet j=a[2];\nlet k=2<3;'))),
            JSON.stringify([{ "Line": 1, "Type": "Variable Declaration", "Name": "i", "Condition": null, "Value": "x" }, { "Line": 2, "Type": "Variable Declaration", "Name": "j", "Condition": null, "Value": "a[2]" }, { "Line": 3, "Type": "Variable Declaration", "Name": "k", "Condition": null, "Value": "2<3" }])
        );
    });

});

describe('Test Table', () => {
    it('is building table rows correctly', () => {
        assert.equal(
            createTable(createArray(parseCode('i=2;'))),
            "<tr><th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr><tr><td>1</td><td>Assignment Expression</td><td>i</td><td>null</td><td>2</td></tr>"
        );
    });
});

describe('Test Expressions', () => {
    it('is processing left and right side member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('a[x]=2;\nx=a[0];'))),
            JSON.stringify([{ "Line": 1, "Type": "Assignment Expression", "Name": "a[x]", "Condition": null, "Value": "2" }, { "Line": 2, "Type": "Assignment Expression", "Name": "x", "Condition": null, "Value": "a[0]" }])
        );
    });

    it('is processing update expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('i++;'))),
            JSON.stringify([{"Line":1,"Type":"Update Expression","Name":null,"Condition":null,"Value":"i++"}])
        );
    });

    it('is processing update expression with prefix correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('++i;'))),
            JSON.stringify([{"Line":1,"Type":"Update Expression","Name":null,"Condition":null,"Value":"++i"}])
        );
    });

    it('is processing identifier init correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('i=x;'))),
            JSON.stringify([{ "Line": 1, "Type": "Assignment Expression", "Name": "i", "Condition": null, "Value": "x" }])
        );
    });

    it('is processing complex binary expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(x[3]+((x+3)-(2*3))+x){}'))),
            JSON.stringify([{ "Line": 1, "Type": "If Statement", "Name": null, "Condition": "(x[3]+((x+3)-(2*3)))+x", "Value": null }])
        );
    });

    it('is processing member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if (X < V[mid]){}'))),
            JSON.stringify([{ "Line": 1, "Type": "If Statement", "Name": null, "Condition": "X<V[mid]", "Value": null }])
        );
    });

    it('is processing unary expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn -1;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "-1" }])
        );
    });

    it('is processing binary expression in return statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn 1+3;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "1+3" }])
        );
    });

    it('is processing complex member expression correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('x[2+3]=0;'))),
            JSON.stringify([{ "Line": 1, "Type": "Assignment Expression", "Name": "x[2+3]", "Condition": null, "Value": "0" }])
        );
    });
});

describe('Test Functions', () => {
    it('is processing function correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(x){}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 1, "Type": "Variable Declaration", "Name": "x", "Condition": null, "Value": null }])
        );
    });

    it('is processing parameters correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(X){\nreturn x;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 1, "Type": "Variable Declaration", "Name": "X", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "x" }])
        );
    });
});

describe('Test Statements', () => {
    it('is processing if statement+binary statemant correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(i<2){}'))),
            JSON.stringify([{ "Line": 1, "Type": "If Statement", "Name": null, "Condition": "i<2", "Value": null }])
        );
    });

    it('is processing for statment correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('for(let i=0; i<2; i=i+2){}'))),
            JSON.stringify([{"Line":1,"Type":"For Statement","Name":null,"Condition":"i<2","Value":null},{"Line":1,"Type":"Variable Declaration","Name":"i","Condition":null,"Value":"0"},{"Line":1,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"i+2"}])
        );
    });

    it('is processing for statment without declaration correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('for(i=0; i<2; i=i+2){}'))),
            JSON.stringify([{"Line":1,"Type":"For Statement","Name":null,"Condition":"i<2","Value":null},{"Line":1,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"0"},{"Line":1,"Type":"Assignment Expression","Name":"i","Condition":null,"Value":"i+2"}])
        );
    });

    it('is processing while statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('while(true){}'))),
            JSON.stringify([{"Line":1,"Type":"While Statement","Name":null,"Condition":"true","Value":null}])
        );
    });

    it('is processing return statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('function f(){\nreturn 1;}'))),
            JSON.stringify([{ "Line": 1, "Type": "Function Declaration", "Name": "f", "Condition": null, "Value": null }, { "Line": 2, "Type": "Return Statment", "Name": null, "Condition": null, "Value": "1" }])
        );
    });

    it('is processing else statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if (i==3)\ni=2;\nelse\ni=1;'))),
            JSON.stringify([{ "Line": 1, "Type": "If Statement", "Name": null, "Condition": "i==3", "Value": null }, { "Line": 2, "Type": "Assignment Expression", "Name": "i", "Condition": null, "Value": "2" }, { "Line": 3, "Type": "Else Statment", "Name": null, "Condition": null, "Value": null }, { "Line": 4, "Type": "Assignment Expression", "Name": "i", "Condition": null, "Value": "1" }])
        );
    });

    it('is processing else-if statement correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(x)\ni=2;\nelse if(y)\ni=3;'))),
            JSON.stringify([{ "Line": 1, "Type": "If Statement", "Name": null, "Condition": "x", "Value": null }, { "Line": 2, "Type": "Assignment Expression", "Name": "i", "Condition": null, "Value": "2" }, { "Line": 3, "Type": "Else If Statement", "Name": null, "Condition": "y", "Value": null }, { "Line": 4, "Type": "Assignment Expression", "Name": "i", "Condition": null, "Value": "3" }])
        );
    });

    it('is processing many else statments correctly', () => {
        assert.equal(
            JSON.stringify(createArray(parseCode('if(a==2)\na=1;\nelse if(a==3)\na=2;\nelse\na=1;'))),
            JSON.stringify([{ "Line": 1, "Type": "If Statement", "Name": null, "Condition": "a==2", "Value": null }, { "Line": 2, "Type": "Assignment Expression", "Name": "a", "Condition": null, "Value": "1" }, { "Line": 3, "Type": "Else If Statement", "Name": null, "Condition": "a==3", "Value": null }, { "Line": 4, "Type": "Assignment Expression", "Name": "a", "Condition": null, "Value": "2" }, { "Line": 5, "Type": "Else Statment", "Name": null, "Condition": null, "Value": null }, { "Line": 6, "Type": "Assignment Expression", "Name": "a", "Condition": null, "Value": "1" }])
        );
    });
});