import * as types from './../constants/ActionTypes';


 // Generate ID
var s4 = () => { 
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

var generateID = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var findIndex = (tasks, id) => {
    var result = -1;
    tasks.forEach((task, index) => {
        if (task.id === id) {
            result = index;
        }
    })
    return result;
}

var data = JSON.parse(localStorage.getItem('tasks'));
var initialState = data ? data : []; // state.tasks trong app.js

var myReducer = (state = initialState, action) => {
	var id = '';
	var index = -1;
	switch(action.type) {
		/*case types.LIST_ALL : 
			return state;*/
		case types.SAVE_TASK :
			console.log(action);
			var task = {
				id : action.task.id,
				name : action.task.name,
				status : action.task.status
			}
			if(!task.id) {
				task.id = generateID();
				state.push(task);
			} else {
				index = findIndex(state, task.id);
				state[index] = task;
			}
			localStorage.setItem('tasks', JSON.stringify(state));
			return [...state]; // copy ra 1 cái array mới và trả về
		case types.UPDATE_STATUS_TASK :
			console.log(action);
			id = action.id;
        	index = findIndex(state, id);
            // state[index].status = !state[index].status; chỉ cập nhật status ko thì ngoài view ko cập nhật, nên phải cập nhật nguyên 1 object
       		/*var cloneTask = {...state[index]}; đây là cách tạo ra task mới có thay đổi status r replace task mới vào task cũ trong array 
       		cloneTask.status = !cloneTask.status;
       		state[index] = cloneTask;*/
       		state[index] = {
       			...state[index],
       			status : !state[index].status
       		};
       		localStorage.setItem('tasks', JSON.stringify(state));
			return [...state];
		case types.DELETE_TASK : 
			id = action.id;
			index = findIndex(state, id);
			state.splice(index, 1);
			localStorage.setItem('tasks', JSON.stringify(state));
			return [...state];
		default : return state;
	}
}

export default myReducer;