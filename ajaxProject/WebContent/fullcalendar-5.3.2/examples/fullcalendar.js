/*
PAGE생성과정
1. dao, vo -> DB에서 title, start_data, end_date 가지고 오는  method 생성. 
2. GetScheduleServlet -> DB에서 가져온 data를 json type으로 [{title:값, start:값, end:값"},{},...]변환.	
3. ajax방식으로 servlet 파일 get하기.(xhtp, ajax..)
3. js파일에 events option: js의 object type으로 할당.
*/

/*
GetScheduleServlet >>> DB에서 받아온 data를 json형태로 변환 > web에 전송 
> html에서 web data를 받아와 events에 입력.

PutScheduleServlet >>> web에서 선택하여 title,start,end값을 client가 입력 
> html의 createSchedule funk가 읽어와 servlet에 세개의 파라미터를 던져주고, 
servlet에서 받아온 파라미터를 DB와 연동하여 데이터를 추가한다.

DelScheduleServlet >>> web에서 delete하면 title, start 값을 client가 입력라여 전송 
> html의 deleteSchedule Func를 호출하여 받을 파라미터 값을 servlet에 보내주어 
DB와 연동해 데이터를 삭제한다.
*/

let events = [];
var calendar;

//순서가 맞지 않아 events가 호출되지 않아서 function 만들어줌.
document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');

	// events에 값을 할당함.<-GetScheduleServlet 에 뿌려진 data를 가져와서.  => 그게 바 로 xhtp.response.
	let xhtp = new XMLHttpRequest();
	xhtp.onreadystatechange = function () {
		if (xhtp.readyState == 4 && xhtp.status == 200) {
			console.log(xhtp.response);
			//GetScheduleServlet 에서 준 값들.	 
			//[{"title":"meeting1","start":"2020-11-02","end":"2020-11-04"},{"title":"meeting2","start":"2020-11-09T16:00:00","end":"2020-11-09T18:00:00"},{"title":"meeting3","start":"2020-11-11"}]
			let data = xhtp.response;
			data.forEach(function (item) {
				events.push(item);
			});

			//events 값을 할당 한 후 method호출.

			// 화면 보여주는방식.
			calendar = new FullCalendar.Calendar(calendarEl, {
				headerToolbar: {
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay'
				},
				initialDate: '2020-11-12',
				navLinks: true, // can click day/week names to navigate views
				selectable: true,
				selectMirror: true,

				// 선택events.
				select: function (arg) {
					// var title = prompt('스케쥴명:');
					// var start = prompt('시작일정:');
					// var end = prompt('종료일정:');
					console.log(arg);
					showModal(arg); // modal 창 열어 값 입력하는 method. argument 매개변수 지정.
					/*if (title) {
						calendar.addEvent({
							title: title,
							start: arg.start, //start 
							end: arg.end,//end
							allDay: arg.allDay //false
						});
						// DB에 새로운 한건 등록 
						// createSchedule(title, start, end); // 위에서 var로 만들어준 매개변수받아서 한건 등록.
					}
					calendar.unselect()*/
				},

				// 삭제events.
				eventClick: function (arg) {
					if (confirm('Are you sure you want to delete this event?')) { // remove event.
						arg.event.remove();
						let start = arg.event.start; //date type
						if (start.getDate() < 10) {
							start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-0' + start.getDate();
						} else {
							start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
						}
						console.log(arg.event.title, start, arg.event.end);

						// DB에 한건 삭제
						deleteSchedule(arg.event.title, start);

					}
				},
				editable: true,
				dayMaxEvents: true, // allow "more" link when too many events
				events: events
			}); //calendar() method 호출 하는 영역.

			calendar.render();
		}
	}
	xhtp.responseType = 'json';
	xhtp.open('get', '../../GetScheduleServlet'); // 두 파일 경로 맞춰주기.
	xhtp.send();

});

// modal javascript.
function showModal(args) {
	var modal = document.getElementById("myModal");
	modal.style.display = "block";

	var span = document.getElementsByClassName("close")[0]; // 엑스박스
	span.onclick = function () {
		modal.style.display = "none";
	}
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	
	// 달력에서 날자를 선택했을때, 모달 창의 start날짜를 지정 값으로 나오게하기.
	let startDate = document.getElementById('startDate');
	startDate.value = args.startStr;
	
	// 달력에서 날짜를 선택했을 때, 모달 창의 end날짜를 start날짜 이전으로 지정하지 못하게 하기.
	let endDate = document.getElementById('endDate');
	endDate.setAttribute('min',startDate.value);
	

	var saveBtn = document.getElementById('saveBtn');
	saveBtn.onclick = function () {
		let title = document.getElementById('title').value;
		let start = document.getElementById('startDate').value;
		let end = document.getElementById('endDate').value;
		console.log(title, start, end);

		if (title) {
			calendar.addEvent({
				title: title,
				start: start, //arg.start,
				end: end, //arg.end,
				allDay: false //arg.allDay
			});

			// DB에 새로운 한건 등록 			
			createSchedule(title, start, end); // 위에서 let로 만들어준 매개변수받아서 DB에 한건 등록.
		}
		calendar.unselect()
	}

} //end of showModal.


function createSchedule(v1, v2, v3) {
	let xhtp = new XMLHttpRequest();
	xhtp.onreadyStatechange = function () {
		if (xhtp.readyState == 4 && xhtp.status == 200) {
			console.log(xhtp);
		}

	}
	xhtp.open('get', '../../PutScheduleServlet?title=' + v1 + '&start=' + v2 + '&end=' + v3);
	// 메서드 호출할 때 준 파라미터값을 넣는다.
	xhtp.send();
}

function deleteSchedule(v1, v2) {
	let xhtp = new XMLHttpRequest();
	xhtp.onreadyStatechange = function () {
		if (xhtp.readyState == 4 && xhtp.status == 200) {
			console.log(xhtp);
		}

	}
	xhtp.open('get', 'DelScheduleServlet?title=' + v1 + '&start=' + v2);
	// 메소드 호출할때 준 파라미터 값 입력.
	xhtp.send();
}