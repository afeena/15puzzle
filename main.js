/**
 * Created by mainn_000 on 03.06.2015.
 */
"use strict";

var has_solution = function (field) {
    var zero_index = field.indexOf(0);
    var offset = 4;
    var zero_row = ~~(zero_index / offset) + 1;
    var N = 0;

    for (var i = 0; i < 16; i++) {
        var less_count = 0;
        if (field[i] != 0) {
            field.forEach(function (element, index) {

                if (element != 0 && index > i && element < field[i] && element != 0) {
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
    var has_left_cell = (start % offset) - 1 >= 0;
    var has_right_cell = (start % offset) + 1 < offset;
    var has_top_cell = start - offset >= 0;
    var has_bottom_cell = start + offset < field.length;

    if (has_left_cell)
        moviable.push(flip(copy(field), start, start - 1));
    if (has_right_cell)
        moviable.push(flip(copy(field), start, start + 1));
    if (has_top_cell)
        moviable.push(flip(copy(field), start, start - offset));
    if (has_bottom_cell)
        moviable.push(flip(copy(field), start, start + offset));

    return moviable;
};


var h2 = function (state) {
    var dist = 0;

    for (var i = 0; i < state.length; i++) {
        if (state[i] != 0)
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

function shuffle(N){
    var state=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    //var zero=state.indexOf(0);
    var closed={};
    for (var i=0;i<N;i++){
        var child=valid_move(state);
        var rand=~~(Math.random()*child.length);
        if(finded_in_close(closed,child[rand].toString())){
            i--;
            continue;
        }

       state = child[rand];
        closed[child[rand].toString()]=true;
    }
    return state;


}
function init() {
    //return [2, 6, 12, 11, 0, 3, 4, 14, 9, 5, 1, 15, 8, 7, 13, 10];
    //return [ 1, 14, 2, 7, 0, 3, 12, 15, 10, 6, 11, 8, 4, 9, 13, 5 ];
    //return [0, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    //return [15,11,12,0,5,13,2,1,14,7,4,3,10,6,9,8];
    //return [2,6,4,3, 9,5,7,1, 13,15,12,0,8,10,14,11];
    //return [10,3,5,15,12,8,7,0,11,1,4,14,6,2,13,9];
    return [1,2,3,4,5,6,7,8,9,10,11,12,0,13,14,15];

    var i, j;

    var field = [];

    var current = 0;
    var offset = 4;

do {
    for (i = 0; i < 16; i++) {

        current = Math.floor(Math.random() * 16);

        if (field.length == 0) {
            field.push(current);
        }
        else if (field.indexOf(current) >= 0) {
            do {
                current = Math.floor(Math.random() * 16);
            }
            while (field.indexOf(current) >= 0);
            field.push(current);
        }
        else
            field.push(current);
    }
}
while(h2(field)>40);

    return field;
}


function sorter(array) {
    array.sort(function (a, b) {
        return a.h2 - b.h2;
    });
}

function finded_in_close(close, hash) {
    return (close[hash] !== undefined);
}

var solver = function (field) {

    var open = [],
        close = {},
        goal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
        root = {};

    root.state = copy(field);
    root.h2 = h2(root.state);
    root.parent = null;

    open.push(root);

    while (open.length != 0) {

        sorter(open);

        var current_node = open[0];

        if (is_same_array(current_node.state, goal))
            break;

        open.splice(0, 1);

        var child = valid_move(current_node.state);
        var child_len = child.length;

        close[current_node.state.toString()] = true;

        for (var i = 0; i < child_len; i++) {
            var current = child[i];
            var current_hash = current.toString();

            if (finded_in_close(close, current_hash))
                continue;

            open.push({
                state:current,
                parent:current_node,
                h2:h2(current)
            });
        }

    }

    var moves = [];
    for (var current = open[0]; current!= null; current = current.parent) {
        console.log(current);
        moves.push(current);
    }
    moves.reverse();

    return moves;

};


var find_node = function (array, node) {
    var ind = -1;
    array.forEach(function (element, index) {
        if (element.state == node.state) {
            ind = index;
        }
    });
    return ind;
}
var start = function (field) {



    if (!has_solution(field)) {
        console.log("решений нет");
        return;
    }
    var path = solver(field);
    return path;


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

if (module !== undefined) {
    start();
}