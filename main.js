"use strict";

var OFFSET = 4;

var manhattan = function (i, j) { //manhattan distance

    var yi = Math.floor(i / OFFSET);
    var xi = i % OFFSET;
    var yj = Math.floor(j / OFFSET);
    var xj = j % OFFSET;

    return (Math.abs(xi - xj) + Math.abs(yi - yj));
};

var make_move = function (field, from, to) {
    var tmp = field[to];
    field[to] = field[from];
    field[from] = tmp;
    return field;
};

var valid_move = function (field) {
    var moviable = [];

    var start = field.indexOf(0);
    var has_left_cell = (start % OFFSET) - 1 >= 0;
    var has_right_cell = (start % OFFSET) + 1 < OFFSET;
    var has_top_cell = start - OFFSET >= 0;
    var has_bottom_cell = start + OFFSET < field.length;

    if (has_left_cell)
        moviable.push(make_move(copy(field), start, start - 1));
    if (has_right_cell)
        moviable.push(make_move(copy(field), start, start + 1));
    if (has_top_cell)
        moviable.push(make_move(copy(field), start, start - OFFSET));
    if (has_bottom_cell)
        moviable.push(make_move(copy(field), start, start + OFFSET));

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

var is_same_field = function (field_one, field_two) {
    var equal = true;
    if (field_one.length != field_two.length)
        return;

    for (var i = 0; i < field_one.length; i++) {
        if (field_one[i] != field_two[i]) {
            equal = false;
        }
    }
    return equal;
};

var found_in_close = function (close, hash) {
    return (close[hash] !== undefined);
};

var copy = function (array) {
    return [].concat(array);
};

var shuffle = function (N) {
    var state = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    var closed = {};

    for (var i = 0; i < N; i++) {
        var child = valid_move(state);
        var rand = ~~(Math.random() * child.length);
        if (found_in_close(closed, child[rand].toString())) {
            i--;
            continue;
        }

        state = child[rand];
        closed[child[rand].toString()] = true;
    }

    return state;
};

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

        open.sort(function (a, b) {
            return a.h2 - b.h2;
        });

        var current_node = open[0];

        if (is_same_field(current_node.state, goal))
            break;

        open.splice(0, 1);

        var child = valid_move(current_node.state);
        var child_len = child.length;

        close[current_node.state.toString()] = true;

        for (var i = 0; i < child_len; i++) {
            var current_state = child[i];
            var current_hash = current_state.toString();

            if (found_in_close(close, current_hash))
                continue;

            open.push({
                state: current_state,
                parent: current_node,
                h2: h2(current_state)
            });
        }

    }

    var moves = [];
    for (var current = open[0]; current != null; current = current.parent) {
        console.log(current);
        moves.push(current);
    }
    moves.reverse();

    return moves;

};

var start = function (field) {
  return solver(field);
};

if (module !== undefined) {
    start();
}