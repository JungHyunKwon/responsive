"use strict";

/**
 * @name 데이터 이벤트
 * @author (주)한신정보기술 퍼블리셔팀 권정현({@link mailto:kjh3859@hanshinit.co.kr})
 * @version 1.0
 */
try {
	this.jQuery = this.jQuery || undefined;

	//제이쿼리가 있는지 확인
	if(jQuery) {
		//$ 중첩 방지
		(function($) {
			$(function() {
				var count = 0,
					easing = [];

				/**
				 * @name 이징 프로퍼티명 등록
				 * @since 2017-12-18
				 */
				for(var i in $.easing) {
					if(i != "_default" && i != "def") {
						easing.push(i);	
					}
				}

				/**
				 * @name 변수 형태
				 * @param {*} variable
				 * @since 2017-12-18
				 * @return {string}
				 */
				function _typeof(variable) {
					var result = Object.prototype.toString.call(variable).toLowerCase().replace("[object ", "").replace("]", "");
					
					//undefined일때(ie7, ie8에서 찾지 못함)
					if(variable === undefined) {
						result = "undefined";
					
					//NaN일때(숫자로 처리되서 따로 처리함)
					}else if(typeof variable === "number" && isNaN(variable)) {
						result = "NaN";
					
					//document일때
					}else if(result.substr(-8) === "document") {
						result = "document";

					//엘리먼트일때
					}else if(result.substr(-7) === "element") {
						result = "element";

					//제이쿼리 엘리먼트일때
					}else if(typeof variable === "object" && variable.jquery) {
						result = "jqueryElement";
					}

					return result;
				}

				/**
				 * @name 타겟 얻기
				 * @param {object} option
				 * @since 2018-01-08
				 * @return {object}
				 */
				$.fn.getTarget = function(option) {
					if(_typeof(option) != "object") {
						option = {};
					}

					if(_typeof(option.value) == "string") {
						option.value = option.value.split("/");
					}else{
						option.value = "";
					}

					option.result = $();

					this.each(function(index, element) {
						var $this = $(element),
							data = $this.data(),
							value = option.value,
							valueType,
							$target,
							targetType;
						
						if(!value.length) {
							value = data.target;
						}

						valueType = _typeof(value);

						if(valueType == "string") {
							value = value.split("/");
						}else if(valueType != "array") {
							value = [];	
						}

						for(var i = 0; i < value.length; i++) {
							try {
								$target = eval(value[i]);
								targetType = _typeof($target);

								//객체가 아닐때
								if(targetType != "jqueryElement" && targetType != "element" && targetType != "window" && targetType != "document") {
									try {
										$target = $(value[i]);
									}catch(e) {
										$target = $();
									}
								}
							}catch(e) {
								try {
									$target = $(value[i]);
								}catch(e) {
									$target = $();
								}
							}

							option.result = option.result.add($target);
						}
					});

					return option.result;
				};

				//데이터 함수
				$.dataEvent = {
					/**
					 * @name prompt
					 * @since 2017-12-18
					 */
					showPrompt : function(event) {
						var $window = $(window),
							$this = $(this),
							$first = $this.first(),
							data = $first.data(),
							result;

						if(_typeof(data.preventDefault) != "boolean") {
							data.preventDefault = false;
						}
					
						if(_typeof(data.promptTitle) != "string") {
							data.promptTitle = "";
						}

						if(_typeof(data.promptText) != "string") {
							data.promptText = "";
						}
						
						result = prompt(data.promptTitle, data.promptText);

						$first.triggerHandler($.Event("data:showPrompt", {rst : {
							title : data.promptTitle,
							text : data.promptText,
							is : (result) ? true : false,
							isPreventDefault : data.preventDefault
						}}));

						if(data.preventDefault) {
							event.preventDefault();
						}
					},

					/**
					 * @name 인쇄
					 * @since 2017-12-18
					 */
					print : function(event) {
						var $window = $(window),
							$this = $(this),
							$first = $this.first(),
							data = $first.data(),
							$target = $first.getTarget().eq($.inArray("print", data.fn));

						if(_typeof(data.preventDefault) != "boolean") {
							data.preventDefault = false;
						}
						
						if(_typeof(data.printTarget) != "string") {
							data.printTarget = "";
						}

						$first.triggerHandler($.Event("data:print", {rst : {
							state : "before",
							isPreventDefault : data.preventDefault,
							target : data.printTarget
						}}));

						if($target.length && $target[0].print) {
							$target[0].print();
						}else{
							window.print();
						}

						$first.triggerHandler($.Event("data:print", {rst : {
							state : "after",
							isPreventDefault : data.preventDefault,
							target : data.printTarget
						}}));

						if(data.preventDefault) {
							event.preventDefault();
						}
					},
					
					/**
					 * @name 복사
					 * @since 2017-12-18
					 */
					copy : function(event) {
						var $this = $(this),
							$first = $this.first(),
							data = $first.data(),
							result = false,
							$copy = $("#copy"),
							$copyText = $("#copy_text");

						if(_typeof(data.preventDefault) != "boolean") {
							data.preventDefault = false;
						}

						if(!$copy.length) {
							$("body").append("<div id=\"copy\" style=\"overflow-x:hidden; overflow-y:hidden; position:absolute; top:0; left:0; width:0; height:0;\"></div>");
							$copy = $("#copy");
						}

						if(!$("#copy_paste_label").length) {
							$copy.append("<label for=\"copy_text\" id=\"copy_label\">문자</label>");
						}

						if(!$copyText.length) {
							$copy.append("<input type=\"text\" id=\"copy_text\" tabindex=\"-1\" />");
							$copyText = $("#copy_text");
						}

						if(_typeof(data.copyText) == "string") {
							$copyText.val(data.copyText).select();
							result = document.execCommand("copy");
						}

						$first.triggerHandler($.Event("data:copy", {state : result}));

						if(data.preventDefault) {
							event.preventDefault();
						}
					},

					/**
					 * @name 붙여넣기
					 * @since 2017-12-18
					 */
					paste : function(event) {
						var $this = $(this),
							$first = $this.first(),
							data = $first.data(),
							result,
							$target = $first.getTarget();

						if(_typeof(data.preventDefault) != "boolean") {
							data.preventDefault = false;
						}

						$target.focus();
						result = document.execCommand("paste");

						$first.triggerHandler($.Event("data:paste", {state : result}));

						if(data.preventDefault) {
							event.preventDefault();
						}
					},

					/**
					 * @name 아이프레임 내부컨텐츠 높이조정
					 * @since 2017-12-18
					 */
					iframeHeight : function(event) {
						var $this = $(this),
							$first = $this.first(),
							tagName = $first[0].tagName.toLowerCase(),
							data = $first.data();

						if(_typeof(data.iframeInterval) != "number") {
							data.iframeInterval = 0;
						}
						
						if(event.handleObj.type == "load" && tagName == "iframe") {
							if(data.iframeTimer) {
								clearInterval(data.iframeTimer);
								data.iframeTimer = 0;
							}

							data.iframeTimer = setInterval(function() {
								$first.height($first.contents().children("html").height());
							}, data.iframeInterval);
						}
					},

					/**
					 * @name 팝업열기
					 * @since 2017-12-18
					 */
					openPopup : function(event) {
						var $this = $(this),
							$first = $this.first(),
							data = $this.data(),
							prefix = "popup" + $.inArray(event.handleObj.type + "." + event.handleObj.namespace, data.event),
							url = data[prefix + "Url"],
							name = data[prefix + "Name"],
							channelmode = data[prefix + "Channelmode"],
							directories = data[prefix + "Directories"],
							fullscreen = data[prefix + "Fullscreen"],
							height = data[prefix + "Height"],
							left = data[prefix + "Left"],
							loc = data[prefix + "Loc"],
							menubar = data[prefix + "Menubar"],
							resizable = data[prefix + "Resizable"],
							scrollbars = data[prefix + "Scrollbars"],
							status = data[prefix + "Status"],
							titlebar = data[prefix + "Titlebar"],
							toolbar = data[prefix + "Toolbar"],
							top = data[prefix + "Top"],
							width = data[prefix + "Width"],
							replace = data[prefix + "Replace"];

						if(_typeof(url) != "string") {
							url = "";
						}

						if(_typeof(name) != "string") {
							name = "";
						}

						if(channelmode != "yes" && channelmode != "no" && channelmode != 1 && channelmode != 0) {
							channelmode = "no";
						}

						if(directories != "yes" && directories != "no" && directories != 1 && directories != 0) {
							directories = "no";
						}

						if(fullscreen != "yes" && fullscreen != "no" && fullscreen != 1 && fullscreen != 0) {
							fullscreen = "no";
						}

						if(_typeof(height) != "number") {
							height = 0;
						}

						if(_typeof(left) != "number") {
							left = 0;
						}

						if(loc != "yes" && loc != "no" && loc != 1 && loc != 0) {
							loc = "no";
						}

						if(menubar != "yes" && menubar != "no" && menubar != 1 && menubar != 0) {
							menubar = "no";
						}

						if(resizable != "yes" && resizable != "no" && resizable != 1 && resizable != 0) {
							resizable = "no";
						}

						if(scrollbars != "yes" && scrollbars != "no" && scrollbars != 1 && scrollbars != 0) {
							scrollbars = "no";
						}

						if(status != "yes" && status != "no" && status != 1 && status != 0) {
							status = "no";
						}

						if(titlebar != "yes" && titlebar != "no" && titlebar != 1 && titlebar != 0) {
							titlebar = "no";
						}
						
						if(toolbar != "yes" && toolbar != "no" && toolbar != 1 && toolbar != 0) {
							toolbar = "no";
						}
						
						if(_typeof(top) != "number") {
							top = 0;
						}
						
						if(_typeof(width) != "number") {
							width = 0;
						}

						if(_typeof(replace) != "boolean") {
							replace = false;
						}

						data[prefix] = window.open(url, name, "channelmode=" + channelmode + ", directories=" + directories + ", fullscreen=" + fullscreen + ", height=" + height + ", left=" + left + ", location=" + loc + ", channelmode=" + channelmode + ", menubar=" + menubar + ", resizable=" + resizable + ", scrollbars=" + scrollbars + ", status=" + status + ", titlebar=" + titlebar + ", toolbar=" + toolbar + ", top=" + top + ", width=" + width, replace);
					},

					/**
					 * @name 팝업닫기
					 * @since 2017-12-18
					 */
					closePopup : function(event) { 
						var $this = $(this),
							$first = $this.first(),
							$target = $first.getTarget(),
							data = $this.data(),
							prefix = "popup" + $.inArray(event.handleObj.type + "." + event.handleObj.namespace, data.event);
					},
					
					/**
					 * @name 팝업토글
					 * @since 2017-12-18
					 */
					togglePopup : function(event) {
						var $this = $(this),
							$first = $this.first(),
							data = $first.data(),
							prefix = "popup" + $.inArray(event.handleObj.type + "." + event.handleObj.namespace, data.event);
						
						if(data[prefix][0]) {
							closePopup.call($first[0], event);
						}else{
							openPopup.call($first[0], event);
						}
					},

						//콜백 데이터 넘겨줄거 추가 해야됨
					scroll : function(event) {
						var $this = $(this).first(),
							href = $this.attr("href"),
							tabindex = $this.attr("tabindex"),
							hash = $this.attr("id"),
							data = $this.data(), 
							$target = $(data.target);

						if($.inArray(data.easing, easing) == -1) {
							data.easing = "swing";
						}

						if(_typeof(data.duration) != "number") {
							data.duration = 400;
						}

						if(data.type != "offset" && data.type != "position") {
							data.type = "offset";
						}

						if(data.direction != "top" && data.direction != "left") {
							data.type = "top";
						}
						
						if(href) {
							if(!hash) {
								if(href.charAt(0) == "#" && href.length > 1) {
									hash = href.replace("#", "");
								}else{
									hash = "";
								}
							}

							if(!data.to.length) {
								data.to = $(href).first();
							}
						}
						
						var toType = _typeof(data.to);

						if(toType == "string") {
							data.to = $(data.to).first();
							console.log(data.to);
							data.to = data.to[data.type]()[data.direction];
						}else if(toType != "number") {
							data.to = 0;
						}

	console.log(data.to);
						/*if(!$target.is(":animated")) {
							$target.animate({
								["scroll" + data.direction.charAt(0).toUpperCase() + data.direction.slice(1)] : data.to
							}, {
								duration : data.duration,
								easing : data.easing,
								done : function() {
									if(tabindex) {
										$this.focus();
									}else{
										$this.attr("tabindex", -1);
										$this.focus();
										$this.removeAttr("tabindex");
									}
									
									window.location.hash = hash;

									$this.triggerHandler($.Event("data:scroll", {
										object : this
									}));
								}
							});
						}*/

						event.preventDefault();
					},


					/**
					 * @name absolute되어 있는객체 부모를 이용해 영역 잡기
					 * @since 2017-12-18
					 */
					absoluteDomain : function(event) {
						var $this = $(this).first(),
							data = $this.data(),
							css = {
								display : $this.css("display"),
								visibility : $this.css("visibility")
							},
							type = "Height",
							$target = $this.getTarget(),
							$link = $this.getTarget({
								value : data.link	
							});

						//문자일때
						if(_typeof(data.direction) == "string") {
							data.direction = data.direction.toLowerCase();
						}
						
						//4가지 방향 모두다 없을때
						if(data.direction != "top" && data.direction != "right" && data.direction != "bottom" && data.direction != "left") {
							data.direction = "bottom";
						}
						
						//방향이 right 또는 left일때
						if(data.direction == "right" || data.direction == "left") {
							type = "Width";
						}

						//적용
						if(css.display != "none" && css.visibility != "hidden") {
							$target.css("padding-" + data.direction, $this["outer" + type](true));
						}
					},

					show : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = (_typeOf(data.cls) == "string") ? data.cls : "active",
							preventDefault = (_typeOf(data.prvtdft) == "boolean") ? data.prvtdft : false;
						
						//기본기능 초기화
						if(preventDefault) {
							event.preventDefault();
						}

						/*var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$group = $("[data-group='" + data.group + "']").not($this),
							$classTargetGroup = $(), 
							$target = $(data.target),
							$targetGroup = $();

						$group.each(function(index, element) {
							var groupData = $(element).data();

							$classTargetGroup = $classTargetGroup.add($(groupData.clsTarget));
							$targetGroup = $targetGroup.add($(groupData.target));
						});

						if($classTarget.length) {
							$classTargetGroup.removeClass(className);

							$classTarget.addClass(className);
						}else{
							$group.removeClass(className);
							$targetGroup.removeClass(className);

							$this.addClass(className);
							$target.addClass(className);
						}
							
						event.preventDefault();*/
					},

					hide : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$open = $(data.open),
							$target = $(data.target);
						
						if($classTarget.length) {
							$classTarget.removeClass(className);
						}else{
							$open.removeClass(className);
							$target.removeClass(className);
						}

						event.preventDefault();
					}

					/*slideDown : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$group = $("[data-group='" + data.group + "']").not($this),
							$classTargetGroup = $(), 
							$target = $(data.target),
							$targetGroup = $(),
							easing = data.easing || "swing",
							duration = data.duration || 400;

						$group.each(function(index, element) {
							var groupData = $(element).data();

							$classTargetGroup = $classTargetGroup.add($(groupData.clsTarget));
							$targetGroup = $targetGroup.add($(groupData.target));
						});

						if(!$target.is(":animated")) {
							if($classTarget.length) {
								$classTargetGroup.removeClass(className);

								$classTarget.addClass(className);
							}else{
								$group.removeClass(className);
								$targetGroup.removeClass(className);

								$this.addClass(className);
								$target.addClass(className);
							}

							$targetGroup.slideUp(duration, easing, function() {
								$this.triggerHandler($.Event("data:slideDown", {
									object : this,
									state : "up"
								}));
							});

							$target.slideDown(duration, easing, function() {
								$this.triggerHandler($.Event("data:slideDown", {
									object : this,
									state : "down"
								}));
							});
						}

						event.preventDefault();
					},
					
					fadeIn : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$group = $("[data-group='" + data.group + "']").not($this),
							$classTargetGroup = $(), 
							$target = $(data.target),
							$targetGroup = $(),
							easing = data.easing || "swing",
							duration = data.duration || 400;

						$group.each(function(index, element) {
							var groupData = $(element).data();

							$classTargetGroup = $classTargetGroup.add($(groupData.clsTarget));
							$targetGroup = $targetGroup.add($(groupData.target));
						});

						if(!$target.is(":animated")) {
							if($classTarget.length) {
								$classTargetGroup.removeClass(className);

								$classTarget.addClass(className);
							}else{
								$group.removeClass(className);
								$targetGroup.removeClass(className);

								$this.addClass(className);
								$target.addClass(className);
							}

							$targetGroup.fadeOut(duration, easing, function() {
								$this.triggerHandler($.Event("data:fadeOut", {
									object : this,
									state : "out"
								}));
							});

							$target.fadeIn(duration, easing, function() {
								$this.triggerHandler($.Event("data:fadeIn", {
									object : this,
									state : "in"
								}));
							});
						}

						event.preventDefault();
					},

					slideUp : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$open = $(data.open),
							$target = $(data.target),
							easing = data.easing || "swing",
							duration = data.duration || 400;

						if(!$target.is(":animated")) {
							if($classTarget.length) {
								$classTarget.removeClass(className);
							}else{
								$open.removeClass(className);
								$target.removeClass(className);
							}

							$target.slideUp(duration, easing, function() {
								$this.triggerHandler($.Event("data:slideUp", {
									object : this
								}));
							});
						}

						event.preventDefault();
					},
					
					fadeOut : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$open = $(data.open),
							$target = $(data.target),
							easing = data.easing || "swing",
							duration = data.duration || 400;

						if(!$target.is(":animated")) {
							if($classTarget.length) {
								$classTarget.removeClass(className);
							}else{
								$open.removeClass(className);
								$target.removeClass(className);
							}

							$target.slideUp(duration, easing, function() {
								$this.triggerHandler($.Event("data:fadeOut", {
									object : this
								}));
							});
						}

						event.preventDefault();
					},

					toggle : function(event) {					
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$group = $("[data-group='" + data.group + "']").not($this),
							$classTargetGroup = $(), 
							$target = $(data.target),
							$targetGroup = $();

						$group.each(function(index, element) {
							var groupData = $(element).data();

							$classTargetGroup = $classTargetGroup.add($(groupData.clsTarget));
							$targetGroup = $targetGroup.add($(groupData.target));
						});

						if($classTarget.length) {
							$classTargetGroup.removeClass(className);

							$classTarget.toggleClass(className);
						}else{
							$group.removeClass(className);
							$targetGroup.removeClass(className);

							$this.toggleClass(className);
							$target.toggleClass(className);
						}

						event.preventDefault();
					},

					slideToggle : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$group = $("[data-group='" + data.group + "']").not($this),
							$classTargetGroup = $(), 
							$target = $(data.target),
							$targetGroup = $(),
							easing = data.easing || "swing",
							duration = data.duration || 400;
						
						$group.each(function(index, element) {
							var groupData = $(element).data();

							$classTargetGroup = $classTargetGroup.add($(groupData.clsTarget));
							$targetGroup = $targetGroup.add($(groupData.target));
						});

						if(!$target.is(":animated")) {
							if($classTarget.length) {
								$classTargetGroup.removeClass(className);

								$classTarget.toggleClass(className);
							}else{
								$group.removeClass(className);
								$targetGroup.removeClass(className);

								$this.toggleClass(className);
								$target.toggleClass(className);
							}

							$targetGroup.slideUp(duration, easing, function() {
								$this.triggerHandler($.Event("data:slideToggle", {
									object : this,
									state : "up"
								}));
							});

							$target.slideToggle(duration, easing, function() {
								$this.triggerHandler($.Event("data:slideToggle", {
									object : this,
									state : (this.style.display == "block") ? "down" : "up"
								}));
							});
						}

						event.preventDefault();
					},

					fadeToggle : function(event) {
						var $this = $(this),
							data = $this.data(),
							className = data.cls || "active",
							$classTarget = $(data.clsTarget),
							$group = $("[data-group='" + data.group + "']").not($this),
							$classTargetGroup = $(), 
							$target = $(data.target),
							$targetGroup = $(),
							easing = data.easing || "swing",
							duration = data.duration || 400;

						$group.each(function(index, element) {
							var groupData = $(element).data();

							$classTargetGroup = $classTargetGroup.add($(groupData.clsTarget));
							$targetGroup = $targetGroup.add($(groupData.target));
						});

						if(!$target.is(":animated")) {
							if($classTarget.length) {
								$classTargetGroup.removeClass(className);

								$classTarget.toggleClass(className);
							}else{
								$group.removeClass(className);
								$targetGroup.removeClass(className);

								$this.toggleClass(className);
								$target.toggleClass(className);
							}

							$targetGroup.fadeOut(duration, easing, function() {
								$this.triggerHandler($.Event("data:fadeToggle", {
									object : this,
									state : "out"
								}));
							});

							$target.fadeToggle(duration, easing, function() {
								$this.triggerHandler($.Event("data:fadeToggle", {
									object : this,
									state : (this.style.display == "block") ? "in" : "out"
								}));
							});
						}

						event.preventDefault();
					},
					*/
				};

				//data-event라는 속성을 가진 객체에게 이벤트 부여
				$("[data-event]").each(function(index, element) {
					element = $(element);

					var $this = element,
						data = $this.data(),
						triggerType = _typeof(data.trigger);

					//문자일 때
					if(_typeof(data.event) == "string") {
						data.event = data.event.split("/");
					}else{
						data.event = [];
					}
				
					//문자일 때
					if(_typeof(data.i) == "string") {
						data.i = data.i.split("/");
					}else{
						data.i = [];
					}

					//문자 또는 불린일 때
					if(triggerType == "string" || triggerType == "boolean") {
						data.trigger = data.trigger.toString().split("/");
					}else{
						data.trigger = [];
					}

					//문자일 때
					if(_typeof(data.fn) == "string") {
						data.fn = data.fn.split("/");
					}else{
						data.fn = [];
					}

					for(var i = 0; i < data.event.length; i++) {
						//온점 단위로 쪼개기
						data.event[i] = data.event[i].split(".");

						//네임스페이스가 없을때
						if(!data.event[i][1]) {
							data.event[i][1] = "dataEvent" + count;
							count++;
						}

						//결합
						data.event[i] = data.event[i][0] + "." + data.event[i][1];
						
						//함수 존재확인
						if($.dataEvent[data.fn[i]]) {
							//this조정
							if(data.i[i]) {
								$this = $this.getTarget({
									value : data.i[i]
								});

								if(!$this.length) {
									$this = element;
								}
							}

							//대리인 유지해서 이벤트 등록
							$this.on(data.event[i], $.proxy($.dataEvent[data.fn[i]], element.add($this).get()));
							
							//트리거 실행
							if(data.trigger[i] == "true") {
								$this.triggerHandler(data.event[i]);
							}
						}
					}
				});
			});
		})(jQuery);
	}else{
		throw "제이쿼리가 없습니다.";
	}
}catch(e) {
	console.error(e);
}