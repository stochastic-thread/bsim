var CLONER_DEBUG = false; // set to false to disable logs

function ClonerModel(a) {
    this.view = a;
    this.dest = [null, null];
	this.stat={}
    a.image.attr({
        title: "Cloner"
    })
}

ClonerModel.prototype.jsonify = function() {
    return null
};

ClonerModel.prototype.start = function() {
    this.entity = QueueApp.sim.addEntity(ClonerEntity)
};

ClonerModel.prototype.connect = function() {
    this.entity.dest1 = this.dest[0] ? this.dest[0].entity : null;
    this.entity.dest2 = this.dest[1] ? this.dest[1].entity : null;
};

ClonerModel.prototype.showSettings = function() {
    var a = $("#cloner_form");
    QueueApp.form_view = this.view;
    a.show().position({
        of: $(this.view.image.node),
        at: "center center",
        my: "left top"
    })
    $("#hover_form").hide();
    // displayName(this, "cloner_name");
};

ClonerModel.prototype.initStats = function(){
	this.stat["trafficup"] = this.entity.to1
	this.stat["trafficdown"] = this.entity.to2
	this.stat["arrived"] = this.entity.arrived
}

ClonerModel.prototype.saveSettings = function() {
    // rename(this, "cloner_name");
};

ClonerModel.prototype.unlink = function() {
    this.view = null
};

var ClonerEntity = {
        start: function() {
			this.to1 = this.to2 = this.arrived = 0
        },
        onMessage: function(sender, message) {
			this.arrived++
			this.to1++
			this.to2++
			if(this.dest1) this.send(message,1,this.dest1)
			if(this.dest2) this.send(new Data(message),1,this.dest2)
            //(this.to1++, this.dest1 && this.send(message,0,this.dest1))
            //(this.to2++, this.dest2 && this.send(new Data(message),0,this.dest2))
        }
    },
    ClonerView = function(a, b, c, d, e) {
        this.canvas = a;
        this.type = b;
        this.name = c;
        this.username = c;
        this.hidden = [a.rect(d, e, 10, 10), a.rect(d, e, 10, 10)];
        this.width = 45;
        this.height = 45;
        this.image = a.image("images/cloner_gray.png", d, e, this.width, this.height);
        this.x = d;
        this.y = e;
        this.hidden[0].attr({
            "stroke-width": "0"
        });
        this.hidden[1].attr({
            "stroke-width": "0"
        });
        this.image.attr({
            cursor: "move"
        });
        this.image.view = this;
        this.image.animate({
            scale: "1.2 1.2"
        }, 200, function() {
            this.animate({
                scale: "1 1"
            }, 200)
        });
        this.arrows = [null, null];
        this.counters = a.text(d, e, "");
        for (b = 0; b < 2; b++) c = a.image("images/blue-arrow.png", d, e, 18, 18), c.view = this, c.id = b, c.drag(function(a, b) {
            this.attr({
                x: this.ox + a,
                y: this.oy + b
            });
            this.paper.connection(this.conn)
        }, function() {
            this.conn = this.paper.connection(this.view.hidden[this.id], this, PATH_SHADOW_COLOR);
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
                var e = a[b];
                if (e.acceptDrop(c, d, this.view.name)) {
                    this.hide();
                    this.view.connect(e, this.id);
                    return
                }
            }
            a = this.view;
            this.id === 0 ? this.attr({
                x: a.x + a.width + 2,
                y: a.y + 5
            }) : this.attr({
                x: a.x + a.width + 2,
                y: a.y + a.height - 15
            })
        }), this.arrows[b] = c;
        this.moveto(d, e);
        this.image.drag(function(a, b) {
                var c = this.view;
                c.moveto(c.ox + a, c.oy + b)
            }, function() {
                var a = this.view;
                a.ox = a.x;
                a.oy = a.y
            },
            function() {});
        this.image.dblclick(function() {
            this.view.model.showSettings()
        })
    };


ClonerView.prototype.moveto = function(a, b) {
    var c;
    if (!(a > CANVAS_W - this.width || b > CANVAS_H - this.height || a < 0 || b < 0)) {
        this.x = a;
        this.y = b;
        this.image.attr({
            x: a,
            y: b
        });
        this.hidden[0].attr({
            x: this.x + this.width - 10,
            y: this.y + 5
        });
        this.hidden[1].attr({
            x: this.x + this.width - 10,
            y: this.y + this.height - 15
        });
        this.arrows[0].attr({
            x: this.x + this.width + 2,
            y: this.y + 5
        });
        this.arrows[1].attr({
            x: this.x + this.width + 2,
            y: this.y + this.height - 15
        });
        this.counters.attr({
            x: this.x + this.width / 2,
            y: this.y + this.height + 5
        });
        for (c = QueueApp.views.length - 1; c >= 0; c--) QueueApp.views[c].moveConnection(this);
        this.arrows[0].conn && this.canvas.connection(this.arrows[0].conn, 0, 0, 0, 0, this.arrows[0].conn.toView.type == "reverser");
        this.arrows[1].conn && this.canvas.connection(this.arrows[1].conn, 0, 0, 0, 0, this.arrows[1].conn.toView.type == "reverser");
    }
};

ClonerView.prototype.connect = function(a, b) {
    var c = this.canvas.connection(this.hidden[b], a.dropObject(), "#000", 0, 0, a.type == "reverser");

   
     c.line.node.setAttribute("data-from",this.image.node.id);  //adds where the path is coming from
     c.line.node.setAttribute("data-to",a.image.node.id);       //adds where the path is going to

    c.line.attr({
        "stroke-width": 3,
        stroke: "rgba(52,152,219, 0.86)"
    });
    //c.line.node.id = getID();     //here  cloner
    c.fromView = this;
    c.toView = a;
    this.arrows[b].conn = c;
    this.arrows[b].hide();
    this.model.dest[b] = a.model
};

ClonerView.prototype.unlink = function() {
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
    this.arrows[0].remove();
    this.arrows[1].remove();
    this.hidden[0].remove();
    this.hidden[0].remove();
    this.counters.remove()
};

ClonerView.prototype.disconnect = function(a) {
    for (var b = 0; b < 2; b++) {
        var c = this.arrows[b];
        if (c && c.conn && (!a || c.conn.toView === a)) c.conn.line.remove(), c.conn = null, b === 0 ? c.attr({
            x: this.x + this.width + 2,
            y: this.y + 5
        }) : c.attr({
            x: this.x + this.width + 2,
            y: this.y + this.height - 15
        }), c.show()
    }
};

ClonerView.prototype.dropObject = function() {
    return this.image
};

ClonerView.prototype.acceptDrop = function(a, b, c) {
    if (this.name == c) return 0
    return a > this.x - 10 && a < this.x + this.width + 10 && b > this.y - 10 && b < this.y + this.height + 10
};

ClonerView.prototype.moveConnection = function(a) {
    for (var b = 0; b < 2; b++) {
        var c = this.arrows[b];
        c && c.conn && c.conn.toView === a && this.canvas.connection(c.conn, 0, 0, 0, 0, a.type == "reverser")
    }
};

ClonerView.prototype.jsonify = function() {
    for (var a = {
            x: this.x,
            y: this.y,
            type: this.type,
            name: this.name,
            out: [null, null]
        }, b = 0; b < 2; b++) {
        var c = this.arrows[b];
        if (c.conn) a.out[b] = c.conn.toView.name
    }
    if (this.model) a.model = this.model.jsonify();
    return a
};
