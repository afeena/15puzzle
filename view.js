/**
 * Created by mainn_000 on 07.06.2015.
 */

var canvas = new fabric.Canvas('c');
var offset = 4;
var img = {};
var interval;

var diff = function (array1, array2) {

    var diff = [];
    if (array1.length != array2.length)
        return;
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            diff.push(i);
        }
    }
    return diff;
};

var create_img = function (i, j) {

    var png = (j + offset * i) + 1;

    fabric.Image.fromURL('img/' + png + '.png', function (oImg) {
        oImg.left = j * 100;
        oImg.top = i * 100;
        img[(j + offset * i) + 1] = oImg;
        canvas.add(oImg);
    });
};
var flip_img = function (from, to, timeout) {
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
        img[ind].left = (i % offset) * 100;
        img[ind].top = ~~(i / offset) * 100;
        canvas.add(img[ind]);
    }
    return start_state;
};
var img_names = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
async.map(img_names, function (name, callback) {
    fabric.Image.fromURL('img/' + name + '.png', function (oImg) {
        callback(null, {name: name, img: oImg});
    });

}, function (error, results) {
    console.log(results);
    if (error)
        console.log(error);
    results.forEach(function (element) {
        img[element.name] = element.img;
    });

    // console.log(moves[0]);
   var field= new_field();

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
            var change = diff(current, next);

            var img1 = current[change[0]];
            var img2 = current[change[1]]
            flip_img(img[img1], img[img2], timeout);
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
        field=new_field();
        j = 1;
    }


});




