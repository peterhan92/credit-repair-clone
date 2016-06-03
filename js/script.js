$(function() {
	$.ajaxSetup({ async: false });
	
	if($('.servicesbox.radio').length!=0) {
		$('.servicesbox.radio .input_service').change(function() {
			$('.servicesbox.radio').removeClass('active');
			$(this).closest('.servicesbox.radio').addClass('active');
		});
		$('.servicesbox.checkbox .input_service').change(function() {
			if($(this).is(':checked')) {
				$(this).closest('.servicesbox.checkbox').addClass('active');
				$('.totalduetoday').text($(this).parent().siblings().children('.pricespan').text());
			} else {
				$(this).closest('.servicesbox.checkbox').removeClass('active');
				$('.totalduetoday').text('$0.00');
			}
		});
		$('.tabnames .tabnamewrap').click(function() {
			if($(this).hasClass('disabled')) {
				$('.tabnames .tabnamewrap').addClass('disabled');
				$('.billingwrap .tabcontent').find('.mandatory').addClass('nonmandatory').removeClass('mandatory').removeClass('redborder');
				$('.billingwrap .tabcontent').find('.errorinputfield').remove();
				$(this).removeClass('disabled');
				$('.billingwrap .tabcontent').toggle();
				$('.billingwrap .tabcontent').each(function() {
					if($(this).is(':visible')) {
						$(this).find('.nonmandatory').addClass('mandatory').removeClass('nonmandatory');
						$(this).find('.mandatory').each(function() {
							if($(this).parent().find('.mandstar').length<1) { $(this).parent().find('label').first().append('<span class="mandstar">*</span>'); }
						});
					}
				});
			}
		});
		$('.cctypewrap input:radio').change(function() {
			$('.cctypewrap input:radio').closest('.cctypewrap').removeClass('active');
			$(this).closest('.cctypewrap').addClass('active');
		});
	}
	
	if($('.pickboxwrap').length!=0) {
		$('.pickboxwrap').click(function() {
			$(this).find('.pickboxicon').toggle();
			boxid = $(this).attr('id').replace('pickboxwrap_', '');
			$('input[name="pickboxinput['+boxid+']"]').val((($('input[name="pickboxinput['+boxid+']"]').val()==1)?0:1));
		});
	}
	
	if($('.togglesuspreason').length>0) {
		$('.togglesuspreason').change(function() {
			if($('.togglesuspreason').is(':checked')) {
				$('.suspreason').removeClass('hidden');
				$('.suspreason textarea').addClass('mandatory');
			} else {
				$('.suspreason').addClass('hidden');
				$('.suspreason textarea').removeClass('mandatory').removeClass('redborder');
				$('.suspreason').children('.errorinputfield').remove();
			}
		});
	}
	
	if($('form').length>0) {
		$('form').each(function() {
			var form = $(this);
			form.submit(function() {
				$(this).find('.redborder').each(function() {
					toggleErrorInputField($(this), true);				
				});
				
				// check signup pick
				if($(this).find('input[name="pickboxinput[1]"]').length>0) {
					if($(this).find('input[name="pickboxinput[1]"]').val()!=1) {
						alert('Please accept agreements');
						return false;
					}
				}
			
				// validate mandatory fields
				$(this).find('.mandatory').each(function() {
					if($(this).val()=='' || $(this).val().length<1) {
						toggleErrorInputField($(this), false);
					} else {
						toggleErrorInputField($(this), true);
					}
				});
				
				$(this).find('.floatval').each(function() {
					if(($(this).hasClass('mandatory') && $(this).val()=='0.00') || isNaN(parseFloat($(this).val()))) {
						toggleErrorInputField($(this), false);
					} else {
						$(this).val(parseFloat($(this).val()).toFixed(2));
					}
				});
				
				$(this).find('.emailfield').each(function() {
					toggleErrorInputField($(this), isValidEmailAddress($(this).val()));
				});
				
				$(this).find('input[type="checkbox"].mandatory').each(function() {
					toggleErrorInputField($(this), $(this).is(':checked'));
				});
				
				
				// no errors in mandatory fields
				if($(this).find('.errorinputfield').length==0) {
					// validate password if field found
					if(form.find('.passwordfield').length>0) {
						toggleErrorInputField(form.find('.passwordfield'), validatePassword(form));
					}
				}
				
				// still no errors in mandatory fields
				if($(this).find('.errorinputfield').length==0) {
					// validate username if field found
					if(form.find('.usernamefield').length>0) {
						form.find('.usernamefield').each(function() {
							if(!$(this).hasClass('allowblank') || $(this).val()!='') {								
								// validation will resubmit this form
								ajaxValidateUsername($(this));
								return false;
							}
						});
					} else {
						return true;
					}
				}
				
				return false;
			});
		});
	}
	
	if($('.mandatory').length>0) {
		$('.mandatory').each(function() {
			if($(this).parent().find('.mandstar').length<1) {
				$(this).parent().find('label').first().append('<span class="mandstar">*</span>');
			}
		});
	}
	
	if($('.orangebtnsubmit').length>0) {
		$('.orangebtnsubmit').each(function() {
			$(this).replaceWith('<span class="orangebtnleft"><span class="orangebtnright"><span class="orangebtnmid"><input type="submit" value="'+$(this).html()+'"/></span></span></span>');
		});
	}
	if($('.bluebtnsubmit').length>0) {
		$('.bluebtnsubmit').each(function() {
			var btnclass = '';
			$.each($(this).attr('class').split(' '), function(index, classname) { if(classname!='bluebtnsubmit') { btnclass += classname+' '; } });
			$(this).replaceWith('<span class="bluebtnleft"><span class="bluebtnright"><span class="bluebtnmid"><input type="submit" value="'+$(this).html()+'"'+(btnclass!='' ? ' class="'+btnclass.slice(0,-1)+'"' : '')+'/></span></span></span>');
		});
	}
	if($('.orangebtnwrap').length>0) {
		$('.orangebtnwrap').each(function() {
			$(this).replaceWith('<span class="orangebtnleft"><span class="orangebtnright"><span class="orangebtnmid">'+$(this)[0].outerHTML+'</span></span></span>');
		});
	}
	if($('.redbtnwrap').length>0) {
		$('.redbtnwrap').each(function() {
			$(this).replaceWith('<span class="redbtnleft"><span class="redbtnright"><span class="redbtnmid">'+$(this)[0].outerHTML+'</span></span></span>');
		});
	}
	
	if($('.print').length>0) {
		$('.print').click(function() {
			$('.'+$(this).attr('href')).print();
			return false;
		});
	}
	
	if($('.leftmenuwrap').length>0) {
		$('.leftmenuwrap a').click(function() {
			if($(this).siblings('ul').length>0) {
				if($(this).siblings('ul').is(':hidden')) {
					$(this).parent('li').addClass('active');
				} else {
					$(this).parent('li').removeClass('active');
				}
				return false;
			}
		});
	}
	
	if($('.tooltip').length>0) {
		$('.tooltip').each(function() {
			$(this).attr('title', $(this).text()).text('');
		});
		$('.tooltip').powerTip({
			placement: 'e' // north-east tooltip position
		});
	}
		
	if($('.hint').length>0) {
		$('.hint').powerTip({
			placement: 'e' // north-east tooltip position
		});
	}
	
	if($('.explist').length>0) {
		$('.explist li .explititle').click(function() {
			// get boxes state from cookie
			var perfcred = $.cookie('perfcred');
			var perfcred = typeof perfcred=='undefined' ? {} : $.parseJSON(perfcred);
			
			var cookiekey = $(this).parent().attr('id');
			if($(this).siblings('.explidesc').is(':hidden')) {
				$(this).parent('li').removeClass('collapsed').addClass('expanded');
				perfcred[cookiekey] = '1';
			} else {
				$(this).parent('li').removeClass('expanded').addClass('collapsed');
				perfcred[cookiekey] = '0';
			}
			
			// save boxes state into cookie
			$.cookie('perfcred', JSON.stringify(perfcred), { expires:365, path: '/', json: true });
		});
	}
	
	if($('.severity-slider').length>0 && $('.severity-input').length>0) { initSeveritySlider(); }

	if($('.confirm').length>0) {
		$('.confirm').click(function() {
			return confirm('This will '+$(this).attr('title').toLowerCase()+'. Are you sure you want to proceed?');
		});
	}
	
	/*
	if($('.rowtoggletrigger').length>0) {
		$('.rowtoggletrigger').click(function() {
			$(this).siblings('.tableview').find('.toggleablerow').each(function() {
				if($(this).is(':hidden')) {
					$(this).css('display', 'table-row');
				} else {
					$(this).css('display', 'none');
				}
			});
		});
	}
	*/
	
	if($('.tblheader').length>0) { setupTableSort(); }
	
	if($('.careofupdateconform').length>0) {
		$('.careofupdateconform').click(function() {
			return confirm('Are you sure you want to save customers list assigned to this careof? If checked customers are currently assigned to another careof, they will be reassigned to this one.');
		});
	}
	
	/*
	if($('.datefield').length>0) {
		$('.datefield').datepicker({dateFormat:'yy-mm-dd'});
		$('#ui-datepicker-div').wrap('<div class="ui-calendar"></div>');
	}
	*/
	if($('.datefield').length>0) {
		$('.datefield').each(function() {
			$(this).after('<input type="hidden" name="'+$(this).attr('name')+'" value="'+$(this).val()+'" />');
			
			// reformat date for user friendly view
			if($(this).val().length>0) {
				var val = $(this).val().split('-');
				if(val.length==3) {
					$(this).val(val[1]+'/'+val[2]+'/'+val[0]);
				}
			}

			$(this).datepicker({
				dateFormat: 'mm/dd/yy',
				altFormat: 'yy-mm-dd',
				altField: 'input[type="hidden"][name="'+$(this).attr('name')+'"]',
				changeYear: true
			});
			
			// unset name
			$(this).attr('name', '');
		});
		$('#ui-datepicker-div').wrap('<div class="ui-calendar"></div>');
	}
	if($('.timefield').length>0) {
		$('.timefield').timePicker({
			startTime: '05.00 AM',
			endTime: new Date(0, 0, 0, 22, 00, 0),
			show24Hours: false,
			separator: '.',
			step: 15
		});
	}
	
	if($('.focusclear').length>0) {
		$('.focusclear').focus(function() {
			if(typeof $(this).attr('origvalue')=== 'undefined' || $(this).attr('origvalue')==false) {
				$(this).attr('origvalue', $(this).val());
				$(this).val('');
			} else if($(this).val()==$(this).attr('origvalue')) {
				$(this).val('');
			}
		}).blur(function() {
			if(typeof $(this).attr('origvalue')!== 'undefined' && $(this).attr('origvalue')!==false) {
				if($(this).val()=='') { $(this).val($(this).attr('origvalue')); }
			}
		});
	}
	
	/*
	if($('form.editaccount').length>0) {
		$('form.editaccount').submit(function() {
			if($(this).find('input[name="account[experian]"]:checked').val()==1 &&
				$(this).find('input[name="account[transunion]"]:checked').val()==1 &&
				$(this).find('input[name="account[equifax]"]:checked').val()==1 &&
				$(this).find('select[name="account[status]"]').val()!=8 &&
				$(this).find('input[name="account[status]"]').val()!='Deleted') {
				var confirmed = confirm('This account will be marked as Deleted, because no beauraus are selected. Proceed?');
				if(confirmed) {
					$(this).find('select[name="account[status]"]').val(8);
					$(this).find('input[name="account[status]"]').val('Deleted');
				}
				return confirmed;
			}
		});
	}
	*/
	
	$('body').on('click', '.linkshowhidden', showHidden);
	$('body').on('click', '.linkhideshown', hideShown);
	
	if($('.termstoggle').length>0) {
		$('.termstoggle').on('mouseover', function() {
			$('.termswrap').show();
		}).on('mouseout', function() {
			$('.termswrap').hide();
		}).on('click', function() {
			return false;
		});
	}
	
	if($('.richedit').length>0) {
		var myNicEditor = new nicEditor({ fullPanel:true });
		$('.richedit').each(function(index) {
			$(this).attr('id', 'nicEditorInstance'+index);
			myNicEditor.panelInstance('nicEditorInstance'+index);
		});
	}
	
	if($('.promocodeapplybtn').length>0 && $('.promocodeinputfield').length>0) { setPromoCodeButton(); }
	
		
	if($('.processonetimepayment').length>0) {
		$('.processonetimepayment').closest('form').submit(function() {
			if(confirm('Are you sure?')) {
				processOneTimePayment();
			}
			return false;
		});
	}
	
	if($('.pagination_page').length>0) {
		$('.pagination_page').change(function() {
			window.location.href = $(this).val();
		});
	}
	
	if($('.servslider_outerround').length>0) {
		$('.servslider_outerround').hover(function() {
			$('.servslider_outerround').removeClass('active');
			var idx = $(this).hasClass('idx1') ? 'idx1' : ($(this).hasClass('idx2') ? 'idx2' : 'idx3');
			$('.servsliderdescr > div').removeClass('active');
			$('.servsliderdescr').find('.'+idx).addClass('active');
			$(this).addClass('active');
		});
	}
	
	if($('.accordeontrigger').length>0) {
		$('.accordeontrigger').click(function() {
			$(this).parent().find('.accordeonhidden').slideToggle();
		});
	}
	
	if($('.userreviews').find('.nextpage').length>0) {
		$('.userreviews').find('.prevpage').add($('.userreviews').find('.nextpage')).click(function() {
			var idxtotal = $('.reviewspage').length-1;
			var curidx = $('.reviewspage.active').index();
			
			var nextidx = idxtotal<curidx+1 ? 0 : curidx+1;
			var previdx = curidx<1 ? idxtotal : curidx-1;
			
			if($(this).hasClass('prevpage')) {
				var tempnextidx = previdx;
				previdx = nextidx;
				nextidx = tempnextidx;
			}
			
			$('.reviewspage.active').fadeOut('slow', function() {
				$(this).removeClass('active');
				$('.reviewspage').eq(nextidx).fadeIn('slow', function() {
					$(this).addClass('active');
				});
			});
		});
	}
	
	if($('.bxslider').length>0) {
		$('.bxslider').bxSlider({
			controls: false,
			auto: true,
			captions: true
			//pager: false
		});
	}
	
	if($('.ttc-slidein').length>0) {
		$('.ttc-slidein .lefttab').click(function() {
			var newright = $(this).hasClass('open') ? '-=300' : '+=300';
			$(this).parent().animate({right: newright});
			$(this).toggleClass('open');
		});
		$('.ttc-slidein .lefttab').click();
	}
	
	if($('.managernoteswrap').length>0) {
		$('.managernoteswrap .closeoverlay').click(function() {
			$('.managernoteswrap').fadeOut();
		});		
		$('.managernoteswrap').fadeIn();
	}
});

	
function processOneTimePayment() {
	$('.otpstatus').text('Processing...');
	
	var data = $('.processonetimepayment').closest('form').serialize();
	$.post('?action=processonetimepayment&calltype=ajax', data, function(response) {
		response = JSON.parse(response);
		$('.otpstatus').removeClass('red, green').addClass(response.status=='error' ? 'red' : 'green');
		$('.otpstatus').text(response.status.charAt(0).toUpperCase()+response.status.substr(1)+': '+response.message);
	});
}

function showHidden(event) {
	$(this).siblings('input[type="password"]').prop('type', 'text');
	$(this).text('hide').addClass('linkhideshown').removeClass('linkshowhidden');
	return false;
}

function hideShown() {
	$(this).siblings('input[type="text"]').prop('type', 'password');
	$(this).text('show').addClass('linkshowhidden').removeClass('linkhideshown');
	return false;
}

function setPromoCodeButton() {
	$('.promocodeapplybtn').click(function() {
		if($('.promocodeinputfield').val().length<1) {
			alert('Promo code may not be empty'); return false;
		} else {
			ajaxCheckPromoCode();
		}
	});
}

function applyPromoCode(promocode_id) {
	$('.promocodeinputfield').addClass('readonly').attr('readonly', 'readonly');
	$('.promocodeapplybtn').remove();
	
	if(promocode_id==1 || promocode_id==2 || promocode_id==6) {
		var monthNames = ['Jan', 'Feb', 'Mar', "Apr", "May", 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

		var freemonths = 1;
		freemonths = promocode_id==2 ? 2 : freemonths;
		freemonths = promocode_id==6 ? 3 : freemonths;
		
		var note = 'first month free with promo code';
		note = promocode_id==2 ? 'first two months free with promo code' : note;
		note = promocode_id==6 ? 'first three months free with promo code' : note;
	
		var currentDate = new Date();
		//currentDate.setDate(currentDate.getDate()+30);
		var monthnum = currentDate.getMonth()+freemonths > 12 ? (currentDate.getMonth()+freemonths-12) : currentDate.getMonth()+freemonths;
		$('.servicechargedate').html('(Charged on '+monthNames[monthnum]+' '+currentDate.getDate()+' - '+note+')&emsp;');
		currentDate = new Date();
		//currentDate.setDate(currentDate.getDate());
		var monthnum = currentDate.getMonth()+freemonths > 12 ? (currentDate.getMonth()+freemonths)-12 : currentDate.getMonth()+freemonths;
		$('.firstworkfeechargedate').html('(Charged on '+monthNames[monthnum]+' '+currentDate.getDate()+' - '+note+')&emsp;');
	}

	alert('Promo code has been applied successfully');
}

function ajaxCheckPromoCode() {
	$.when($.get('/?action=checkpromocode&calltype=ajax&promocode='+encodeURIComponent($('.promocodeinputfield').val()))).done(function(data) {
		if(isNaN(data) || data<1) {
			alert('Invalid promo code');
		} else {
			applyPromoCode(data);
		}
	});
}

// usernames must be unique, validating with ajax
function ajaxValidateUsername(inputbox) {
	var form = inputbox.closest('form');
	var input = inputbox[0];
	if(input.value==input.lastValue) { return true; }
	if(input.timer) { clearTimeout(input.timer); }
	
	// call ajax function only after 300 milisecs, not immediately
	input.timer = setTimeout(function () {
		$.ajax({
			type: 'get',
			url: '/?action=validateusername&calltype=ajax&username='+input.value,
			data: '',
			success: function(data) {
				if(data=='success') {
					toggleErrorInputField(input, true);
					//if($(form[0]).find('.errorinputfield').length==0) { form.get(0).submit(); }
					form.get(0).submit();
				} else {
					alert(data);
					toggleErrorInputField(input, false);
				}
			}
		});
	}, 300);
	
	// save last value to avoid sending requests when we don't need to
	input.lastValue = input.value;
}

function ajaxSaveSeverity(itemtype, id, value) {
	$.get('/?action=saveseverity&calltype=ajax&itemtype='+itemtype+'&sevid='+id+'&sevval='+value, function(response) {
		if(response=='error') { alert('There was an error saving severity of this item. Please try again.'); }
	});
}

function setupTableSort() {
	$('.tblheader').each(function() {
		$(this).find('span.sort').each(function() {
			$(this).wrapInner('<a href="?'+getSortLink($(this))+'" />');
		});
	});
}

function getSortLink(el) {
	var addonclass = $(el).attr('class').replace('sort', '').replace(' ', '');
	var rowname = addonclass=='' ? el.text() : addonclass;
	var curlink = window.location.href.split('?').length<2 ? '' : window.location.href.split('?')[1];
	var destination = curlink;
	var newsort = rowname.replace('-', '').replace(' ', '_').toLowerCase();
	
	if(curlink.indexOf('sortby') != -1) { // already sorted
		var cursort = curlink.split('sortby=')[1].split('&')[0];
		destination = destination.replace('sortby='+cursort, 'sortby='+newsort);
		if(curlink.indexOf('sortdir') != -1) { // already set sort direction
			var cursortdir = curlink.split('sortdir=')[1].split('&')[0];
			var newsortdir = cursort==newsort && cursortdir=='asc' ? 'desc' : 'asc';
			destination = destination.replace('sortdir='+cursortdir, 'sortdir='+newsortdir);
			if(cursort==newsort) { el.addClass('sort'+cursortdir); }
		}
	} else {
		el.parent().children(':first').addClass('sortasc');
		destination += '&sortby='+newsort;
		if(curlink.indexOf('sortdir') == -1) { // already set sort direction
			var newsortdir = rowname==el.parent().children(':first').text() && curlink.indexOf('sortby')==-1 ? 'desc' : 'asc';
			destination += '&sortdir='+newsortdir;
		}
	}
	
	return destination;
}

function initSeveritySlider() {
	$('.severity-slider').each(function() {
		$(this).slider({
			orientation: "horizontal",
			range: 1,
			min: 1,
			max: 9,
			value: $(this).siblings('.severity-input').val(),
			slide: function(event, ui) {
				$(this).find('.severity-position').text(ui.value);
				$(this).siblings('.severity-input').val(ui.value);
			},
			change: function(event, ui) {
				if(!$(this).siblings('.severity-input').hasClass('disableajaxsave')) {
					var itemtype = $(this).siblings('.severity-input').attr('name').indexOf('accounts')==-1 ? 'publicrecords' : 'accounts';
					var sevid = $(this).siblings('.severity-input').attr('name').replace('severity['+itemtype+'][', '').replace(']', '');
					ajaxSaveSeverity(itemtype, sevid, ui.value);
				}
			}
		});
		$(this).find('.ui-slider-handle').html('<span class="severity-position">'+$(this).siblings('.severity-input').val()+'</span>');	
	});
}

// password validation requires at least 8 characters including one uppercase, one lower case and one number. only english characters
function validatePassword(form) {
	var diffpasswords = form.find('.passwordfield').map(function(){ return $(this).val(); }).get().filter(function(itm,i,a) { return i==a.indexOf(itm); });
	var valid = uppercase = lowercase = number = minlength = true;

	form.find('.passwordfield').each(function() {
		if(minlength && $(this).val().length<8) { minlength = false; }
		if(uppercase && !$(this).val().match(/[A-Z]/)) { uppercase = false; }
		if(lowercase && !$(this).val().match(/[a-z]/)) { lowercase = false; }
		if(number && !$(this).val().match(/\d/)) { number = false; }
	});

	if(valid && diffpasswords.length>1) { alert('Password and confirmation do not match'); valid = false; }
	if(valid && !minlength) { alert('Password must be at least eight characters long'); valid = false; }
	if(valid && !uppercase) { alert('Password must contain at least one UPPERCASE character'); valid = false; }
	if(valid && !lowercase) { alert('Password must contain at least one lowercase character'); valid = false; }
	if(valid && !number) { alert('Password must contain at least one number'); valid = false; }
	
	form.find('.passwordfield').each(function() { toggleErrorInputField($(this), valid); });
	return valid;
}

// shows icon of error in input field plus sets border to red
function toggleErrorInputField(object, hideError) {
	if(!hideError && $(object).parent().children('.errorinputfield').length<1) { // add class with error
		if(!$(object).hasClass('noicon')) { $(object).after('<span class="errorinputfield"></span>'); }
		$(object).addClass('redborder');
		return false;
	} else if(hideError) {
		if($(object).parent().children('.errorinputfield').length>0 && !$(object).hasClass('noicon')) { $(object).parent().children('.errorinputfield').remove(); }
		$(object).removeClass('redborder');
		return true;
	}
}

// email validation method
function isValidEmailAddress(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(email);
};