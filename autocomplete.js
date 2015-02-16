function Autocomplete(options) {
	var elem = options.elem;
	var data = options.data;

	var self = this;

	var input = $("<input>", {
			type: "text",
			autocomplete: "off",
			"class": "autocomplete-input",
		}).appendTo(elem)
		.on("input", onInput)
		.on("blur", onBlur)
		.on("focus", onFocus)
		.on("keydown", onKeyDown);

	var list = $("<ul/>", {
		"class": "autocomplete-list",
	}).appendTo(elem);

	elem.addClass("autocomplete");

	function onInput() {
		var value = input.val();

		closeList();
		clearList();

		if (value.length > 1) fillListFor(value);
		openList();
	}

	function onKeyDown(e) {
		if (e.keyCode == 13 && !listOpened()) {
			triggerChange();
		};

		if (!listOpened()) return;

		switch (e.keyCode) {
			case (38):
				listSelect("prev");
				return false;
				break;
			case (40):
				listSelect("next");
				return false;
				break;
			case (39):
				setValueFromList(true);
				closeList();
				return false;
				break;
			case (13):
				setValueFromList();
				closeList();
				return false;
				break;
			case (27):
				closeList();
				return false;
				break;
		}
	}

	function onBlur() {
		closeList();
	}

	function onFocus() {
		openList();
	}

	function fillListFor(value) {
		var listArr = data.filter(beginsFromValue);

		for (var i = 0; i < listArr.length; i++) {
			var li = $("<li/>", {
				"class": "autocomplete-list-item",
				html: listArr[i],
			}).appendTo(list);
		};

		list.find("li").eq(0).addClass("selected");

		function beginsFromValue(item) {
			var lItem = item.toLowerCase();
			var lValue = value.toLowerCase();
			if (lItem.indexOf(lValue) == 0) return true;

			return false;
		}
	}

	function clearList() {
		list.empty();
	}

	function closeList() {
		elem.removeClass("opened");
	}

	function openList() {
		if (list.children().length) elem.addClass("opened");
	}

	function listOpened() {
		return elem.hasClass("opened");
	}

	function listSelect(method) {
		var selected = $(".autocomplete-list-item.selected");
		var newSelected = selected[method]();

		if (!newSelected.length) return;

		selected.removeClass("selected");
		newSelected.addClass("selected");
	}

	function setValueFromList(quiet) {
		var selected = $(".autocomplete-list-item.selected");

		setValue(selected.html(), quiet);
	}

	function setValue(newValue, quiet) {
		input.val(newValue);

		if (!quiet) triggerChange();
	}

	function triggerChange() {
		$(self).triggerHandler({
			type: "change",
			value: input.val(),
		});
	}

}