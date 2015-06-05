/**
 * Created by mainn_000 on 03.06.2015.
 */
"use strict";

function init() {
      var i, j;

    var field = [];

    var current = 0;
    var offset = 4;
    for (i = 0; i < 16; i++) {

        current = Math.floor(Math.random() * 16);

        if (field.length==0){
            field.push(current);
        }
        else
       if(field.indexOf(current)>=0) {
           do {
               current = Math.floor(Math.random() * 16);
           }
           while (field.indexOf(current) >= 0);
           field.push(current);
       }
        else
           field.push(current);
    }

    return field;
}

var has_solution = function (field) {
    var zero_index = field.indexOf(0);
    var offset = 4;
    var zero_row = Math.floor(zero_index / offset)+1;
    var N = 0;

    for (var i = 0; i < 16; i++) {
        var less_count = 0;
        if (field[i] != 0) {
            field.forEach(function (element, index) {

                if (element != 0 && index > i && element < field[i] &&  element != 0) {
                    less_count++;
                }
            });

            N += less_count + zero_row;
        }
    }

    if (N % 2 == 0)
        return true;
};
var manhattan = function (i, j) { //manhattan distance
    var offset = 4;
    var yi = Math.floor(i / offset);
    var xi = i % offset;
    var yj = Math.floor(j / offset);
    var xj = j % offset;

    return (Math.abs(xi - xj) + Math.abs(yi - yj));
};
var flip = function (array, from, to) {
    var tmp = array[to];
    array[to] = array[from];
    array[from] = tmp;
    return array;
};
var valid_move = function (field) {
    var moviable = [];
    var offset = 4;
    var start = field.indexOf(0);
    var has_left_cell = (start - 1) >= 0 && Math.floor((start - 1) / offset) == Math.floor(start / offset);
    var has_right_cell = (start + 1) < field.length && Math.floor((start + 1) / offset) == Math.floor(start / offset);
    var has_top_cell = start - offset >= 0;
    var has_bootom_cell = start + offset < field.length;

    if (has_left_cell)
        moviable.push(start - 1);
    if (has_right_cell)
        moviable.push(start + 1);
    if (has_top_cell)
        moviable.push(start - offset);
    if (has_bootom_cell)
        moviable.push(start + offset);

    return moviable;
};
var h2 = function (state) {
    var dist = 0;

    for (var i = 0; i < state.length; i++) {
        if (state[i].number != 0)
            dist += manhattan(i, state[i] - 1);
        else
            dist += manhattan(i, 15);

    }


    return dist;
};
var is_same_array = function (array1, array2) {
    var equal = true;
    if (array1.length != array2.length)
        return;

    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            equal = false;
        }
    }
    return equal;
};

var solver = function (field) {
    var close = [];
    var open = [];
    var node = {};
    var goal = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,0];

    node.state = copy(field);
    node.parent=null;
    node.h2 = h2(node.state);
   // node.g = 0;
   // node.cost = node.h2 + node.cost;

    open.push(node);

    while (open.length != 0) {
        open.splice(0, 1);
        close.push(node);

        if (is_same_array(node.state, goal)) {
            return close;
        }

        var child = valid_move(node.state);

        for (var i = 0; i < child.length; i++) {
            var next_node = {};
            next_node.state = flip(copy(node.state), node.state.indexOf(0), child[i]);
            next_node.parent=clone(node);
            next_node.h2 = h2(next_node.state);
            //next_node.g = node.g + 1;
           // next_node.cost = next_node.h2 + next_node.g;

            if (close.some(function (element) {
                    return is_same_array(element.state, next_node.state);
                })) {
                continue;
            }

            if (open.some(function (element) {
                    return is_same_array(element.state, next_node.state);
                })) {
                continue;
                //open.forEach(function (element, index) {
                //    if (is_same_array(element.state, next_node.state)) {
                //        if (element.g > next_node.g) {
                //            element.parent = clone(next_node.parent);
                //            element.g = next_node.g;
                //        }
                //    }
                //
                //});

            }

            open.push(clone(next_node));
        }

        open.sort(function (a, b) {
            if (a.h2 < b.h2)
                return -1;

            if (a.h2 > b.h2)
                return 1;

            return 0;
        });

        node = clone(open[0]);
    }


};

var start = function () {

    var field = init();
    if (!has_solution(field)) {
        console.log("решений нет");
        return;
    }
    var path = solver(field);

    console.log(path.length,path[path.length-1]);


};

var copy = function (array) {
    return [].concat(array);

};
function clone(obj) {
    if (!obj || 'object' !== typeof obj) {
        return obj;
    }
    var c = 'function' === typeof obj.pop ? [] : {};
    var p, v;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            v = obj[p];
            if (v && 'object' === typeof v) {
                c[p] = clone(v);
            }
            else {
                c[p] = v;
            }
        }
    }
    return c;
}

start();