if (!com)
	var com = {};
if (!com.logicpartners)
	com.logicpartners = {};
if (!com.logicpartners.labelControl)
	com.logicpartners.labelControl = {};
	
com.logicpartners.labelControl.generatezpl = function(designer) {
	var self = this;
	this.designer = designer;
	this.workspace = $("<div></div>").addClass("designerLabelControl").attr("title", "Label Size").css({ float : "right" });
	
	this.buttonContainer = $("<div></div>").appendTo(this.workspace);
	this.button = $("<button>Generate ZPL</button>").css({ "line-height" : "30px" }).appendTo(this.buttonContainer)
		.on("click", function() {
			var zpl = self.designer.generateZPL();
			var dialog = $("<div></div>").prop("title", "Generated ZPL");
			
			var output = $("<textarea></textarea>").css({ "white-space": "nowrap", resize: "none", width: "100%", height: "100%" }).val(zpl.data + zpl.zpl).appendTo(dialog);
			
			var Toolbar = toolbar;
			dialog.dialog({
				modal : true,
				width : 470,
				height : 400
			});
			
			output.select();
		});
		
	this.update = function() {
		this.widthController.val(this.designer.labelWidth / this.designer.dpi);
		this.heightController.val(this.designer.labelHeight / this.designer.dpi);
	}
}