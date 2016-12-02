(function(window,$) {

	$(document).on('ready',function(){

		if ( $('#customer_info').length < 1) return;
		setMessageEvent();

		return false;
	});

	/* =======================================================================
		Get Content -- Array
	========================================================================== */
	function getContent() {

		var assignee = $('#customer_info').find('.base_table').find('tr').find('th:contains(社名/担当者)').next().get(0).innerText.split(/(\r\n|\n|\r)/gm)[0];
		var $infos   = $('#order_info').find('.base_table').find('tr').find('td').find('ul li:contains(カートNo.)').find('a');
		var cartNum  = $infos.eq(0).get(0).innerText;
		var orderNum = $infos.eq(1).get(0).innerText;

		var dir    = cartNum.replace(' ','') + '_' + assignee + '様';
		var child1 = orderNum.split('').slice('1').join('');
		var child2 = orderNum.split('-')[1] + ' もと';

		return {
			parent   : dir,
			child    : [child1,child2],
			location : window.location.href,
			title    : $('title').text()
		};
		
	}

	/* =======================================================================
		Set Message Event
	========================================================================== */
	function setMessageEvent() {

		chrome.runtime.onMessage.addListener(
			function (request, sender, sendResponse) {

				if (request.status == 'request') {

					var param = getContent();
					sendResponse(param);

				}

			}
		);

	}

})(window,jQuery);
