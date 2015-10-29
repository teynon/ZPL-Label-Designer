if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
	
com.logicpartners.labelInspector = function(designer, canvas) {
	this.canvas = canvas;
	this.canvasElement = $(canvas);
	this.labelDesigner = designer;
	var self = this;
	this.boundingBox = null;
	
	this.updatePosition = function(xchange) {
		this.inspectorWindow.css("width", parseInt(this.inspectorWindow.css("width")) + xchange);
		this.boundingBox = this.inspectorWindow[0].getBoundingClientRect();
	}
	
	// Create the property window.
	this.inspectorWindow = $('<div></div>')
			.addClass("designerUtilityToolbar designerUtilityLabelInspector")
			.css({
				"left": this.labelDesigner.toolbar.boundingBox.left,
				"top": this.canvas.getBoundingClientRect().top - 50,
				"width" : this.labelDesigner.propertyInspector.boundingBox.right - this.labelDesigner.toolbar.boundingBox.left
			})
			//.draggable({handle: "div.designerPropertyTitle"})
			.insertAfter(this.canvasElement);


	this.toolsViewContainer = $('<div></div>')
			.addClass("designerLabelContent")
			.appendTo(this.inspectorWindow);

	/*
	this.titleBar = $('<div>Tools</div>')
			.addClass("designerPropertyTitle")
			.prependTo(this.toolsWindow)
			.on("dblclick", function() {
				self.toolsViewContainer.toggle();
			});
	*/

	this.buttonView = $('<div></div>')
			.appendTo(this.toolsViewContainer);
	
	this.update = function(activeElement) {
	}
	
	this.addTool = function(controller) {
		console.log(controller.workspace.html());
		this.buttonView.append(controller.workspace);
	}
}