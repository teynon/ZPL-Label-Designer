if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.designerTools)
	com.logicpartners.designerTools = {};
	
com.logicpartners.designerTools.image = function() {
	var self = this;
	this.counter = 1;
	this.data = null;
	this.width = null;
	this.height = null;
	this.button = $("<div></div>").addClass("designerToolbarImage designerToolbarButton").attr("title", "Image").append($("<div></div>"));
	this.activate = function(toolbar) {
		self.data = null;
		
		// Open up a dialog to get the image
		var dialog = $("<div></div>").prop("title", "Add Image");
		var imageFile = $("<input type=\"file\" />").css({ width : 400 })
		.on("change", function() {
			if (typeof window.FileReader !== 'function') {
				alert('This page requires the file API that is included in modern browsers such as Google Chrome. Please try again in an up to date web browser.');
			}
			
			var input = imageFile[0];
			if (!input.files[0]) {
				alert('Please select a file to insert.');
			}
			else {
				var file = input.files[0];
				var reader = new FileReader();
				var insertImg = imageLeft;
				var canvasResult = imageRight;
				reader.onloadend = function() {
					var canvas = canvasResult;
					var imgSelf = insertImg;
					insertImg.css( { "width" : "auto", "height" : "auto", "max-width" : 200, "max-height" : 200 });
					canvas.css( { "width" : "auto", "height" : "auto" });
					insertImg[0].onload = function() {
						var tCanvas = $("<canvas />");
						tCanvas[0].width = imgSelf[0].width;
						tCanvas[0].height = imgSelf[0].height;
						canvas[0].width = imgSelf[0].width;
						canvas[0].height = imgSelf[0].height;
						var tctx = tCanvas[0].getContext("2d");
						var ctx = canvas[0].getContext("2d");
						tctx.drawImage(imgSelf[0], 0, 0, tCanvas[0].width, tCanvas[0].height);
						var tImgData = tctx.getImageData(0, 0, tCanvas[0].width, tCanvas[0].height);
						var imgData = ctx.getImageData(0, 0, tCanvas[0].width, tCanvas[0].height);
						
						// Convert the canvas data to GRF.
						for (var y = 0; y < tCanvas[0].height; y++) {
							for (x = 0; x < tCanvas[0].width; x++) {
								var pixelStart = 4 * (tCanvas[0].width * y + x);
								var luminance = tImgData.data[pixelStart] * 0.299 + tImgData.data[pixelStart + 1] * 0.587 + tImgData.data[pixelStart + 2] * 0.114;
								
								if (luminance > 127) {
									imgData.data[pixelStart] = 255;
									imgData.data[pixelStart + 1] = 255;
									imgData.data[pixelStart + 2] = 255;
									imgData.data[pixelStart + 3] = 255;
								}
								else {
									imgData.data[pixelStart] = 0;
									imgData.data[pixelStart + 1] = 0;
									imgData.data[pixelStart + 2] = 0;
									imgData.data[pixelStart + 3] = 255;
								}
							}
						}
						self.width = canvas[0].width;
						self.height = canvas[0].height;
						self.data = imgData.data;
						
						ctx.putImageData(imgData, 0, 0);
					}
					insertImg[0].src = reader.result;
				}
				reader.readAsDataURL(file);
			}
		}).appendTo(dialog);
		var imageContainer = $("<div></div>").css({ "padding-top" : "5px" });
		var imageLeft = $("<img />").prop("src", "blank.gif").prop("border", "none").css({ float: "left", width: 200, height: 200, border: "1px solid #DDDDDD"}).appendTo(imageContainer);
		var imageRight = $("<canvas />").css({ float: "right", width: 200, height: 200, border: "1px solid #DDDDDD"}).appendTo(imageContainer);
		
		imageContainer.appendTo(dialog);
		
		var Toolbar = toolbar;
		dialog.dialog({
			modal : true,
			width : 470,
			height : 400,
			buttons : {
				"Insert" : function() {
					// Insert the image onto the screen.
					Toolbar.labelDesigner.addObject(new self.object(0, 0, self.width, self.height, self.data));
					console.log("test");
					$(this).dialog("close");
				},
				"Cancel" : function() {
					self.data = null;
					$(this).dialog("close");
				}
			}
		})
		.on("dialogclose", { toolbar : toolbar }, function(event) {
			self.button.removeClass("designerToolbarButtonActive");
			event.data.toolbar.setTool(null);
			console.log(self.data);
		});
	};
	
	this.object =  function(x, y, width, height, data) {
		this.uniqueID = self.counter;
		this.name = "Image " + self.counter++;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.data = data;
		
		this.readonly = [ "width", "height", "data" ];
		this.hidden = [ "data", "uniqueID" ];
		
		this.getZPLData = function() {
			var GRFVal = function(nibble) {
				var nibbleMap = { 
					"0" : "0000",
					"1" : "0001",
					"2" : "0010",
					"3" : "0011",
					"4" : "0100",
					"5" : "0101",
					"6" : "0110",
					"7" : "0111",
					"8" : "1000",
					"9" : "1001",
					"A" : "1010",
					"B" : "1011",
					"C" : "1100",
					"D" : "1101",
					"E" : "1110",
					"F" : "1111",
				};
				
				for (key in nibbleMap) {
					if (nibbleMap[key] == nibble) {
						return key;
					}
				}
				
				return "";
			}
			
			var imgData = "";
			var bytesPerLine = Math.ceil(this.width / 8);
			console.log(bytesPerLine);
			console.log(this.width);
			console.log(bytesPerLine);
			for (var y = 0; y < this.height; y++) {
				var nibble = "";
				var bytes = 0;
				for (var x = 0; x < this.width; x++) {
					var point = 4 * (this.width * y + x);
					if (this.data[point+1] == 0) {
						nibble += "1";
					}
					else nibble += "0";
					
					if (nibble.length > 7) {
						imgData += GRFVal(nibble.substring(0, 4)) + GRFVal(nibble.substring(4, 8));
						nibble = "";
						bytes++;
					}
				}
				
				if (nibble.length > 0) {
					while (nibble.length < 8) nibble += "0";
					imgData += GRFVal(nibble.substring(0, 4)) + GRFVal(nibble.substring(4, 8));
					nibble = "";
					bytes++;
				}
				
				while (bytes < bytesPerLine) {
					imgData += GRFVal("0000") + GRFVal("0000");
					bytes++;
				}
				
				imgData += "\n";
			}
			
			return "~DGIMG" + this.uniqueID + "," + bytesPerLine * height + "," + bytesPerLine + "," + imgData;
		},
		
		
		
		this.toZPL = function(labelx, labely, labelwidth, labelheight) {
			return "^FO" + (this.x - labelx) + "," + (this.y - labely) + "^XGR:IMG" + this.uniqueID + ",1,1^FS";
		},

		this.draw = function(context, width, height) {
			var ctxData = context.getImageData(0, 0, width, height);
			for (var y = 0; y < this.height; y++) {
				for (var x = 0; x < this.width; x++) {
					if (this.x + x >= 0 && this.x + x < width
						&& this.y + y >= 0 && this.y + y < height) {
						var drawPoint = 4 * (width * (this.y + y) + this.x + x);
						var drawFromPoint = 4 * (this.width * y + x);
						ctxData.data[drawPoint] = this.data[drawFromPoint];
						ctxData.data[drawPoint + 1] = this.data[drawFromPoint + 1];
						ctxData.data[drawPoint + 2] = this.data[drawFromPoint + 2];
						ctxData.data[drawPoint + 3] = this.data[drawFromPoint + 3];
					}
				}
			}
			
			context.putImageData(ctxData, 0, 0);
		}
		
		this.setWidth = function(width) {
			//this.width = width;
		}
		
		this.getWidth = function() {
			return this.width;
		}
		
		this.setHeight = function(height) {
			//height = height;
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

