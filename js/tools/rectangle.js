if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.rectangle = function() {
	var self = this;
	this.counter = 1;
	this.button = $("<div></div>").addClass("designerToolbarRectangle designerToolbarButton").attr("title", "Rectangle").append($("<div></div>"));
	this.object =  function(x, y, width, height) {
		this.name = "Rectangle " + self.counter++;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this.getZPLData = function() {
			return "";
		}

		this.toZPL = function(labelx, labely, labelwidth, labelheight) {
			if (this.width > this.height) {
				return "^FO" + (this.x - labelx) + "," + (this.y - labely) + "^GB" + this.width + ",0," + this.height + "^FS";
			}
			
			return "^FO" + (this.x - labelx) + "," + (this.y - labely) + "^GB" + "0," + this.height + "," + this.width + "^FS";
		}
		
		this.draw = function(context) {
			context.fillRect(this.x, this.y, this.width, this.height);
		}
		
		this.setWidth = function(width) {
			this.width = parseInt(width);
		}
		
		this.getWidth = function() {
			return this.width;
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
			context.dashedStroke(parseInt(this.x + 1), parseInt(this.y + 1), parseInt(this.x) + parseInt(this.width) - 1, parseInt(this.y) + parseInt(this.height) - 1, [2, 2]);
		}

		this.hitTest = function(coords) {
			return (coords.x >= parseInt(this.x) && coords.x <= parseInt(this.x) + parseInt(this.width) && coords.y >= parseInt(this.y) && coords.y <= parseInt(this.y) + parseInt(this.height));
		}
	}
}