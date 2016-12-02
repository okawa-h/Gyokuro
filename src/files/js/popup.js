(function(window,$) {

	var _$submit;
	var API_URL = 'http://192.168.0.39:8888/api/gyokuro/';
	// var API_URL = 'http://192.168.0.68:8888/tokyo/Gyokuro/src/files/php/';

	$(document).on('ready',function(){

		_$submit = $('#submit');
		init();

		return false;
	});

	/* =======================================================================
		Init
	========================================================================== */
	function init(event) {

		chrome.tabs.query({ active:true }, function(tab) {
			chrome.tabs.sendMessage(tab[0].id, { status:'request' }, function(response) {

				console.log(response);

				if (!response) {

					$('h1').append('<span>※対応していないページです。</span>');
					_$submit.remove();

				}
				
				if (response) {

					setDownload(response);

				}
				
			});
		});

		return false;
	}

	/* =======================================================================
		Set Download
	========================================================================== */
	function setDownload(response) {

		var filename = response['parent'];

		request = {
			action  : 'create',
			parent  : filename,
			child   : response['child'].join(','),
			location: response['location'],
			title   : response['title']
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', API_URL, true);
		xhr.onload = function(res) {

				console.log(res);
		};
		xhr.onreadystatechange = function(event) {

			if (xhr == '') return false;
			if (xhr.readyState == 4) {

				_$submit.prop('download',filename + '.zip');
				_$submit.prop('href',API_URL + 'download/' + filename + '.zip');

			}

		};

		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(encodeHTMLForm(request));

	}

	/* =======================================================================
		Encode HTML Form
	========================================================================== */
	function encodeHTMLForm( data ) {

		var params = [];
		for(var name in data) {

			var value = data[name];
			var param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			params.push(param);

		}

		return params.join('&').replace(/%20/g,'+');
	}

})(window,jQuery);
