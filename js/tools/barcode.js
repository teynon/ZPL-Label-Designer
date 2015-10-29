if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.barcode = function() {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarBarcode designerToolbarButton").attr("title", "Barcode").append($("<div></div>"));
	this.object = function(x, y, width, height) {
		var width = 100;
		var canvasHolder = $("<canvas></canvas>").prop("width", "100").prop("height", "1");
		this.name = "Barcode " + self.counter++;
		this.text = "BARCODE";
		this.x = x;
		this.y = y;
		//this.width = width;
		this.height = height;
		
		this.getZPLData = function() {
			return "";
		}

		this.toZPL = function(labelx, labely, labelwidth, labelheight) {
			return "^FO" + (this.x - labelx) + "," + (this.y - labely) + "^BY1^B3N,N," + this.height + "N,N^FD" + this.text + "^FS";
		}

		this.draw = function(context) {
			console.log(this.text);
			canvasHolder.JsBarcode(this.text, { width: 1, height : 1});
			var cwidth = canvasHolder[0].width;
			var cheight = canvasHolder[0].height;
			var ctx = canvasHolder[0].getContext('2d');
			width = cwidth;
			
			var cData = ctx.getImageData(0, 0, cwidth, cheight);
			
			for (var i = 0; i < cwidth; i++) {
				if (cData.data[i * 4 + 3] == 255) { // Black (barcode = black or white)
					// Draw a black rectangle at this point.
					context.fillRect(this.x + i, this.y, 1, this.height);
				}
			}
		}
		
		this.setWidth = function(width) {
			//this.width = width;
		}
		
		this.getWidth = function() {
			return width;
		}
		
		this.setHeight = function(height) {
			this.height = height;
		}
		
		this.getHeight = function() {
			return this.height;
		}

		this.setHandle = function(coords) {
			this.handle = this.resizeZone(coords);
		}

		this.getHandle = function() {
			return this.handle;
		}

		this.drawActive = function(context) {
			context.dashedStroke(parseInt(this.x + 1), parseInt(this.y + 1), parseInt(this.x) + parseInt(width) - 1, parseInt(this.y) + parseInt(this.height) - 1, [2, 2]);
		}

		this.hitTest = function(coords) {
			return (coords.x >= parseInt(this.x) && coords.x <= parseInt(this.x) + parseInt(width) && coords.y >= parseInt(this.y) && coords.y <= parseInt(this.y) + parseInt(this.height));
		}
	}
};