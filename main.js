console.log("Hi");
var taskList = [
    {id: 1, name: 'Create Home Screen', start: null, end: null, totalMin: 25, brakeMin: 5, status: 'New'},
    {id: 2, name: 'Create about Screen', start: null, end: null, totalMin: 25, brakeMin: 5, status: 'New'},
    {id: 3, name: 'Create Gallery Screen', start: null, end: null, totalMin: 25, brakeMin: 5, status: 'New'},
    {id: 4, name: 'Create Contract Screen', start: null, end: null, totalMin: 25, brakeMin: 5, status: 'New'}
];
var currentTask = null;
var counterInterval;
var taskMin = null;
var taskSec = null;
var brakeMin = null;
var brakeSec = null;
taskTable();

function startTask(id){
    let findIndex = taskList.findIndex(val => val.id === id);
    taskList[findIndex].start = new Date().toLocaleString();
    taskList[findIndex].status = 'Committed';
    currentTask = taskList[findIndex];
    taskTable();
    taskMin = currentTask.totalMin;
    taskSec = 0;
    document.querySelector(".counter").classList.add("show");
    document.querySelector(".counter").classList.remove("brake");
    document.querySelector(".counter p").innerText = currentTask.name;
    document.querySelector(".counter button").classList.add("showBtn");
    couter(taskMin, taskSec, 'task');
}

function endTask(id){
    let findIndex = taskList.findIndex(val => val.id === id);
    taskList[findIndex].end = new Date().toLocaleString();
    taskList[findIndex].status = 'Done';
    clearInterval(counterInterval);
    document.querySelector(".counter h2").innerText = "00:00";
    taskTable();
    document.querySelector(".counter").classList.remove("show");
}

function brake(){
    document.querySelector(".counter").classList.add("brake");
    document.querySelector(".counter p").innerText = "You are in brake";
    document.querySelector(".counter button").classList.remove("showBtn");
    clearInterval(counterInterval);
    brakeMin = currentTask.brakeMin;
    brakeSec = 0;
    couter(brakeMin, brakeSec, 'brake');
}

function couter(min, sec, type){
    let getTime = min;
    let getsec = sec;
    counterInterval = setInterval(()=>{
        if(getTime >= 1){
            if(getsec === 0){
                getTime -= 1;
                getsec = 59;
            }
            else{
                getsec -= 1;
            }
        }
        else{
            if(getsec >= 1){
                getTime = 0;
                getsec -= 1;
            }
            else{
                getTime = 0;
                getsec = 0;
                clearInterval(counterInterval);
                document.querySelector(".counter h2").innerText = "00:00";
                type === 'task' ? endTask(currentTask.id) : (couter(taskMin, taskSec, 'task'), document.querySelector(".counter").classList.remove("brake"), document.querySelector(".counter p").innerText = currentTask.name);
                //console.log('Done');
            }
        }
        if(type === 'task'){
            taskMin = getTime;
            taskSec = getsec;
        }
        else{
            brakeMin = getTime;
            brakeSec = getsec;
        }
        document.querySelector(".counter h2").innerHTML = `${getTime > 9 ? getTime : '0'+getTime} : ${getsec > 9 ? getsec : '0'+getsec}`;
    },1000)
}

function taskTable(){
    const tableBody = document.querySelector(".taskListTable table tbody");
    let taskHTML = '';
    taskList.map((val, index, array) => {
        let buttonStatus = array.some(value => value.status.toLowerCase() === 'committed');
        let checkCurrentTask = val.status.toLowerCase() === 'committed' ? true : false;
        let checkDoneTask = val.status.toLowerCase() === 'done' ? true : false;
        taskHTML += `<tr>
                <td>${val.id}</td>
                <td>${val.name}</td>
                <td>${val.status}</td>
                <td>${val.totalMin} mins</td>
                <td>${val.brakeMin} mins</td>
                <td>${val.start ? val.start : '-'}</td>
                <td>${val.end ? val.end : '-'}</td>
                ${checkDoneTask ? '<td><button type="button" disabled="true">Done</button></td>' : checkCurrentTask ? '<td><button type="button" onClick="endTask('+ val.id +')">Done</button></td>' : buttonStatus ? '<td><button type="button" disabled="true">Start</button></td>' : '<td><button type="button" onClick="startTask('+ val.id +')">Start</button></td>'}
            </tr>`;
    });
    tableBody.innerHTML = taskHTML;
}