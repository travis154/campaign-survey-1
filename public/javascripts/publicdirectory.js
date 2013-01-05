var socket = io.connect('http://localhost:5000');

$(function(){
	$("#submit-survey").on('click', function(){
		var self = $(this);
		self.attr('disabled','disabled');
		var answers = [];
		$('.question').each(function(v, el){
			answers.push({
				question: $(el).find('.question-text').text().trim(),
				answer: $(el).find('.btn-group button.active').text()
			});
		})
		$.post('/new-survey', {answers: JSON.stringify(answers)}, function(){
			$('.question .btn-group button.active').removeClass('active');
			self.removeAttr('disabled');
		});
	});
	
	socket.on('count', function(data){
		$("#suveys_done").text(data.count);
	});
});

