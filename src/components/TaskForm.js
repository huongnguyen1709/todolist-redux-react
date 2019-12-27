import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../actions/index';

class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id : '',
            name : '',
            status : false
        }
    }

    UNSAFE_componentWillMount() {
        if(this.props.taskEditing) {
            this.setState({
                id : this.props.taskEditing.id,
                name : this.props.taskEditing.name,
                status : this.props.taskEditing.status
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.taskEditing) {
             this.setState({
                id : nextProps.taskEditing.id,
                name : nextProps.taskEditing.name,
                status : nextProps.taskEditing.status
            })
        } else if (nextProps && nextProps.taskEditing === null) {
            this.setState({ // lúc này nextProps.taskEditing bằng null nên ko có gán state id: nextProps.task.id, mà setState trực tiếp cho id là rỗng lun
                id : '',
                name : '',
                status : false
            })
        }
    }

    onCloseForm = () => {
        this.props.onCloseForm();
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name
        var value = target.value;
        if (name === 'status') {
            value = target.value === 'true' ? true : false;
        }
        this.setState({
            [name] : value
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        /*this.props.onSubmit(this.state)*/
        this.props.onSaveTask(this.state); // chuyển cái state thành tham số of action trong reducer of store
        // Cancel & Close Form
        this.onClear();
        this.onCloseForm();
    }

    onClear = () => {
        this.setState({ // ko set id, vì nếu set là rỗng thì nó lại rơi vào trường hợp thêm
            name : '',
            status : false
        })
    }

    render() {
        var { id } = this.props.taskEditing;
        if(!this.props.isDisplayForm) return '';
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        { id ? 'Cập Nhật Công Việc' : 'Thêm Công Việc' }
                        <span 
                            className="fa fa-times-circle text-right"
                            onClick = { this.onCloseForm }
                        >
                        </span>
                    </h3>
                </div>
                <div className="panel-body">
                    <form onSubmit={this.onSubmit} >
                    
                        <div className="form-group">
                            <label>Tên: </label>
                            <input 
                                type="text" 
                                className="form-control"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChange}
                            />
                        </div>
                        <label>Trạng Thái: </label>
                        <select 
                            name="status" 
                            className="form-control"
                            value={this.state.status}
                            onChange={this.onChange}
                        >
                            <option value={true}>Kích Hoạt</option>
                            <option value={false}>Ẩn</option>
                        </select><br/>
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning">
                                <span className="fa fa-plus mr-5"></span>Lưu lại
                            </button>&nbsp;
                            <button 
                                type="button" 
                                className="btn btn-danger"
                                onClick={this.onClear}
                            >
                                <span className="fa fa-close mr-5"></span>Hủy bỏ
                            </button>&nbsp;
                        </div>
                      
                    </form>
                </div>
            </div>
        )
    }
  
}

const mapStateToProps = state => { // const mapStateToProps = (state) => {} 
    return  {
        isDisplayForm : state.isDisplayForm,
        taskEditing : state.itemEditing
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSaveTask : (task) => { // onAddTask là arrow function, có tham số đầu vào là task
            dispatch(actions.saveTask(task));
        },

        onCloseForm : () => {
            dispatch(actions.closeForm());
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TaskForm);
