/* Imageview processes entities created by the user into image form and pushes them into the model 
Queue to be processed once the simulation runs.  Added an id tag to images so that they can be animated
when the simulation runs using D3 */

var ImageView = function(a, b, c, d, e, f, g) {
    this.canvas = a;
    this.type = b;
    this.name = c;
    this.username = c;
    this.id;
    this.color = "blue";

	switch(this.type) {
		case "source":
            this.height = 45;
            this.width = 45;
			this.image = a.image("images/source_gray.png", d, e, this.width, this.height);
			break;

		case "sink":
			this.height = this.width = 45, this.image = a.image("images/sink_gray.png", d, e, this.width, this.height);
			break;

		case "queue":
			this.width = 32, this.height = 32, this.image = a.image("images/queue_gray.png", d, e, this.width, this.height);
			break;

		case "stack":
			this.width = 32, this.height = 32, this.image = a.image("images/stack_gray.png", d, e, this.width, this.height);
			break;

		case "func":
			this.width = 42, this.height = 25, this.image = a.image("images/func_gray.png", d, e, this.width, this.height);
			break;

		case "thermometer":
			this.width = 40, this.height = 40, this.image = a.image("images/thermometer_gray.png", d, e, this.width, this.height);
			break;		
	}
    this.x = d;
    this.y = e;
    this.hasIn = f;
    this.hasOut = g;
    this.text = a.text(d, e, this.username);
    this.text.node.children[0].setAttribute("style", "font-size: 14px;font-weight: normal; fill: #c2c2c2");
    this.counters = a.text(d,
        e, "");
    this.counters.hide();
    this.image.attr({
        cursor: "move"
    });
    this.image.view = this;
    this.image.animate({
        scale: "1.05 1.05"
    }, 200, function() {
        this.animate({
            scale: "1 1.05"
        }, 200)
    });
    if (this.hasOut) this.arrow = a.image("images/blue-arrow.png", d, e, 15,15), this.arrow.view = this, this.arrow.drag(function(a, b) {
        this.attr({
            x: this.ox + a,
            y: this.oy + b
        });
        this.paper.connection(this.conn, 0, 0, 0, 0, a.type == "reverser")
    }, function() {
        this.conn = this.paper.connection(this.view.image, this, PATH_SHADOW_COLOR);
        this.conn.line[0].setAttribute("stroke-width","2"); //make  path shadow thicker
        this.ox = this.attr("x");
        this.oy = this.attr("y")
    }, function() {
        this.conn.line.remove();
        this.conn = null;
        var a = QueueApp.views,
            b = a.length,
            c = this.attr("x"),
            d = this.attr("y");
        for (b -= 1; b >= 0; b--) {
            var f = a[b];
            if (f.acceptDrop(c, d, this.view.name)) {
                this.hide();
                this.view.connect(f);
                return
            }
        }
        a = this.view;
        this.attr({
            x: a.x + a.width + 2,
            y: a.y + a.height / 2 - 6
        })
    });
    this.moveto(d, e);
    this.image.drag(function(a, b) {
        var c = this.view;
        c.moveto(c.ox + a, c.oy + b)
    }, function() {
        var a = this.view;
        a.ox = a.x;
        a.oy = a.y
    }, function() {});
    this.image.dblclick(function() {
        this.view.model.showSettings()
    })
};
ImageView.prototype.moveto = function(a, b) {
  // console.log("moveto");
    var c;
    if (!(a > CANVAS_W - this.width || b > CANVAS_H - this.height || a < 0 || b < 0)) {
        this.x = a;
        this.y = b;
        this.image.attr({
            x: a,
            y: b
        });
        this.text.attr({
            x: this.x + this.width / 2,
            y: this.y + this.height + 5
        });
        this.counters.attr({
            x: this.x + this.width / 2,
            y: this.y + this.height + 20
        });
        this.arrow && this.arrow.attr({
            x: this.x + this.width + 2,
            y: this.y + this.height / 2 - 6
        });
        if (this.hasIn) {
            c = QueueApp.views.length;
            for (c -= 1; c >= 0; c--) QueueApp.views[c].moveConnection(this)
        }
        this.arrow && this.arrow.conn && this.canvas.connection(this.arrow.conn, 0, 0, 0, 0, this.arrow.conn.toView.type == "reverser")
    }
};
ImageView.prototype.connect = function(a) {
  //console.log("connect");

    var b = this.canvas.connection(this.image, a.dropObject(), "#000", 0, 0, a.type == "reverser");


    //a = where the path is going
    //this = where the path is coming from

    b.line.node.setAttribute("data-from",this.image.node.id);   //adds where the path is coming from
    b.line.node.setAttribute("data-to",a.image.node.id);       //adds where the path is going to


    b.line.attr({
        "stroke-width": 3,
        stroke: "rgba(52,152,219, 0.86)"
    });
	/* NOTE WHAT IS THIS? */
    //b.line.node.id = getID(); //here source
    b.fromView = this;
    b.toView = a;
    this.arrow.conn = b;
    this.arrow.hide();
    this.model.dest = a.model
};
ImageView.prototype.unlink = function() {
  //console.log("unlink");
    var a, b;
    a = QueueApp.models.length;
    for (a -= 1; a >= 0; a--)
        if (QueueApp.models[a] === this.model) {
            b = a;
            break
        }
    b && QueueApp.models.splice(b, 1);
    this.model && this.model.unlink();
    this.disconnect();
    a = QueueApp.views.length;
    for (a -= 1; a >= 0; a--) QueueApp.views[a].disconnect(this), QueueApp.views[a] === this && (b = a);
    QueueApp.views.splice(b, 1);
    this.image.remove();
    this.arrow && this.arrow.remove();
    this.counters.remove();
    this.text.remove()
};
ImageView.prototype.disconnect = function(a) {
    //console.log("disconnect");
    if (this.arrow && this.arrow.conn && (!a || this.arrow.conn.toView === a)) this.arrow.conn.line.remove(), this.arrow.conn = null, this.arrow.attr({
        x: this.x + this.width + 2,
        y: this.y + this.height / 2 - 6
    }), this.arrow.show(), this.model.dest = null
};
ImageView.prototype.dropObject = function() {
    // console.log("dropObject");
    return this.image
};
ImageView.prototype.acceptDrop = function(a, b, c) {
    //console.log("acceptDrop");
    if (this.name == c) return 0
    return !this.hasIn ? !1 : a > this.x - 10 && a < this.x + this.width + 10 && b > this.y - 10 && b < this.y + this.height + 10
};
ImageView.prototype.moveConnection = function(a) {
    //console.log("moveConnection");
    this.arrow && this.arrow.conn && this.arrow.conn.toView === a && this.canvas.connection(this.arrow.conn, 0, 0, 0, 0, a.type == "reverser")
};
ImageView.prototype.jsonify = function() {
    var a = {
        x: this.x,
        y: this.y,
        type: this.type,
        name: this.name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
		username: this.username.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    };
    if (this.arrow && this.arrow.conn) a.out = this.arrow.conn.toView.name;
    if (this.model) a.model = this.model.jsonify();
    return a
};
ImageView.prototype.showCounters = function() {};
