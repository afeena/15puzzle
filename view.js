
var canvas = new fabric.Canvas('c');
var OFFSET = 4;
var img = {};
var interval;
var img_names = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

var field_diff = function (field_one, field_two) {

    var diff = [];
    if (field_one.length != field_two.length)
        return;
    for (var i = 0; i < field_one.length; i++) {
        if (field_one[i] != field_two[i]) {
            diff.push(i);
        }
    }
    return diff;
};
var swap_img = function (from, to, timeout) {
    var from_left = from.getLeft();
    var from_top = from.getTop();

    var to_left = to.getLeft();
    var to_top = to.getTop();

    from.animate('left', to_left, {
        duration: timeout * 0.8,
        onChange: canvas.renderAll.bind(canvas)
    });
    from.animate('top', to_top, {
        duration: timeout * 0.8,
        onChange: canvas.renderAll.bind(canvas)
    });
    to.animate('left', from_left, {
        duration: timeout * 0.8,
        onChange: canvas.renderAll.bind(canvas)
    });
    to.animate('top', from_top, {
        duration: timeout * 0.8,
        onChange: canvas.renderAll.bind(canvas)
    });
};
var pause = function () {
    clearInterval(interval);
    interval = 0;
};
var new_field = function () {
    var start_state = shuffle(15);

    for (var i = 0; i < start_state.length; i++) {
        var ind = start_state[i];
        img[ind].left = (i % OFFSET) * 100;
        img[ind].top = ~~(i / OFFSET) * 100;
        canvas.add(img[ind]);
    }
    return start_state;
};

async.map(img_names, function (name, callback) {
    fabric.Image.fromURL('img/' + name + '.png', function (oImg) {
        callback(null, {name: name, img: oImg});
    });

}, function (error, results) {

    if (error)
        console.log(error);
    results.forEach(function (element) {
        img[element.name] = element.img;
    });

    var field = new_field();

    var start_bt = document.getElementById('start');
    var pause_bt = document.getElementById('pause');
    var restart_bt = document.getElementById('restart');
    var j = 1;
    var moves;

    start_bt.onclick = function () {
        if (j == 1) {
            moves = start(field);
        }
        var current = moves[j - 1].state;

        var timeout = 100;
        interval = setInterval(function () {
            var next = moves[j].state;
            var change = field_diff(current, next);

            var img1 = current[change[0]];
            var img2 = current[change[1]];
            swap_img(img[img1], img[img2], timeout);
            current = next;
            j++;
            if (j == moves.length)
                clearInterval(interval);
        }, timeout);
    };

    pause_bt.onclick = function () {
        pause();
    };

    restart_bt.onclick = function () {
        pause();
        field = new_field();
        j = 1;
    }


});




