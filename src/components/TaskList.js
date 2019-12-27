import React, { Component } from 'react';
import TaskItem from './TaskItem';
// import connect vs store để lên lấy tasks về chứ ko lấy từ app.js nữa
import { connect } from 'react-redux';
import * as actions from './../actions/index';

class TaskList extends Component {

    /*constructor(props) {
        super(props);
        this.state = {
            filterName : '',
            filterStatus : -1 // all : -1, active : 1, deactive : 0
        }
    }*/

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        var filter = {
            name : name === 'filterName' ? value : this.props.filterTable.name,
            status : name === 'filterStatus' ? value : this.props.filterTable.status
        };
        this.props.onFilterTable(filter);
    }

    render() {
        var { tasks, filterTable, keyword, sort } = this.props; // var tasks = this.props.tasks, lấy từ trên store
        
        // filter on table
        if(filterTable) {
            if(filterTable.name) {
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filterTable.name.toLowerCase()) !== -1;
                });
            }
            tasks = tasks.filter((task) => {
                if(filterTable.status === -1) {
                    return task;
                } else {
                    return task.status === (filterTable.status === 1 ? true : false)
                }
            });
        }

        // Search
        if (keyword) {
            tasks = tasks.filter((task) => {
                return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            }) 
        }

        // Sort
        if(sort.by === 'name') {
            tasks.sort((a, b) => {
                if(a.name > b.name) { return sort.value; } // tăng dần, lớn hơn 0 thì b sẽ đứng trước a
                else if (a.name < b.name) { return -sort.value; } // giảm dần
                else return 0; // tất cả
            })
        } else {
            tasks.sort((a, b) => {
                if(a.status > b.status) { return -sort.value; }
                if(a.status < b.status) { return sort.value; }
                else return 0;
            })
        }

        var elmTasks = tasks.map((task, index) => {
            return <TaskItem 
                        key={task.id} 
                        index={index} 
                        task={task} 
                    />
        })
        return (
            <table className="table table-bordered table-hover mt-15">
                <thead>
                    <tr>
                        <th className="text-center">STT</th>
                        <th className="text-center">Tên</th>
                        <th className="text-center">Trạng Thái</th>
                        <th className="text-center">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <input 
                                type="text" 
                                name="filterName"
                                className="form-control"
                                value={filterTable.name}
                                onChange={this.onChange}
                            />
                        </td>
                        <td>
                            <select 
                                name="filterStatus"  
                                className="form-control"
                                value={filterTable.status}
                                onChange={this.onChange}
                            >
                                <option value={-1}>Tất Cả</option>
                                <option value={0}>Ẩn</option>
                                <option value={1}>Kích Hoạt</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>

                    { elmTasks }
                    
                </tbody>    
            </table>
        )
    }
  
}

// redux sẽ chuyển các state of store thành các props of component
const mapStateToProps = (state) => {
    return {
        tasks : state.tasks, // state.tasks này chính là tasks trong file index.jx of reducers
        filterTable : state.filterTable,
        keyword : state.search,
        sort : state.sort
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onFilterTable : (filter) => {
            dispatch(actions.filterTask(filter));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
