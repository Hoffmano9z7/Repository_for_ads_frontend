import React, { useState, forwardRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogContent from '@material-ui/core/DialogContent';    
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import ErolledStudentManagement from './enrolledStudentManagement'

const API_URL = 'https://ads-enrollment-system.herokuapp.com/';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(1),
    },    
    departmentSelect: {
        margin: theme.spacing(1),
        minWidth: 400,
    },
}));

export default () => {
    
    const classes = useStyles();
    const [state, setState] = useState({
        columns: [
            { title: 'Course ID', field: '_id', editable: 'never' },
            { title: 'Title', field: 'title' },
            { title: 'Department', field: 'deptNames', editable: 'never' },
            { title: 'Level', field: 'level' },
            { title: 'Class Size', field: 'classSize' },
            { title: 'Available Place', field: 'availablePlace', editable: 'never' },
            { title: 'Year', field: 'year'},
        ],
        data: [],
        stuMap: {},
        isLoading: true,
        isDeptSelectionDisplay: false,
        departments: [],
        selectedDept: [],
        callback: () => {},
        rejectCall: () => {}
    });

    function handleSelectChange(event) {
        console.log('event.target.name: ' + event.target.name + ', event.target.value: ' + event.target.value)
        setState(oldState => ({
            ...oldState,
            [event.target.name]: event.target.value,
        }));
    }

    function updatePlace(courseId, change) {
        return setState(oldState => ({
            ...oldState,
            data: oldState.data.map( course => {
                if (course._id == courseId)
                    course.availablePlace += change;
                return course;
            }),
        }))
    }

    function toggleDeptSelectionDisplay(reject) {
        if (reject)
            state.rejectCall();
        setState(oldState => ({
            ...oldState,
            isDeptSelectionDisplay: !oldState.isDeptSelectionDisplay,
        }))
    }

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        axios.get(`${API_URL}getCouseInfo`)
        .then( res => {
            const course = res.data;
            if (!!course) {
                axios.get(`${API_URL}getStudent`)
                .then ( res => {
                    const students = res.data;
                        let stuMap = {}
                        students.forEach( stu => {
                            stuMap[stu._id] = stu._id
                        })
                        setState(oldState => ({
                            ...oldState,
                            data: course.map( course => {
                                course.availablePlace = course.classSize - course.enrolled.length;
                                course['deptNames'] = course.department.map( dept => dept.deptName).join(', ');
                                return course;
                            }),
                            stuMap: stuMap,
                            isLoading: false,
                        }))
                        axios.get(`${API_URL}getDepartment`)
                        .then( res => {
                            const departments = res.data;
                            if (!!departments) {
                                setState(oldState => ({
                                    ...oldState,
                                    departments: departments,
                                }))
                                departments.length === 0 && enqueueSnackbar('No department found!', {variant: 'warning'})
                            }
                        })
                        .catch(err => {
                            enqueueSnackbar(err.toString(), {variant: 'error'})
                        })
                    }
                )
            } else {
                enqueueSnackbar("No course found", {variant: 'error'})
            }
        })
        .catch(err => {
            enqueueSnackbar(err.toString(), {variant: 'error'})
        })
    }, []);

    return (
        <React.Fragment>
            <MaterialTable
                title="Course Management"
                isLoading={state.isLoading}
                icons={tableIcons}
                columns={state.columns}
                data={state.data}
                options={{
                    actionsColumnIndex: -1
                }}
                detailPanel={rowData => (
                    <Grid 
                        container 
                        spacing={3} 
                        justify="center"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12} sm={11}>
                            <ErolledStudentManagement courseTitle={rowData.title} courseId={rowData._id} enrolled={rowData.enrolled} stuMap={state.stuMap} updatePlace={updatePlace}/>
                        </Grid>
                    </Grid>
                )}
                editable={{
                    onRowAdd: newData =>
                        new Promise( (resolve, reject) => {
                            setState(oldState => ({
                                ...oldState,
                                rejectCall: () => {
                                    reject();
                                },
                                callback: (selectedDept) => {
                                    toggleDeptSelectionDisplay()
                                    const { title, level, classSize, year } = newData
                                    let query = `${API_URL}addCourse?title=${title}&level=${level}&classSize=${classSize}&year=${year}`
                                    if ( selectedDept.length > 0 && !(selectedDept.length === 1 && selectedDept[0] === ''))
                                        query += `&deptId[]=${selectedDept.join('&deptId[]=')}`

                                    axios.post(query)
                                    .then( res => {
                                        if (res.data.status) {
                                            setTimeout(() => {
                                                resolve();
                                                const data = [...state.data];
                                                newData._id = res.data.id
                                                newData.deptNames = res.data.deptNames.join(', ')
                                                data.push(newData);
                                                setState({ ...state, data });
                                                enqueueSnackbar('Add success', {variant: 'success'})
                                            }, 600);
                                        } else {
                                            reject();
                                            enqueueSnackbar(res.data.err, {variant: 'error'})
                                        }
                                    })
                                    .catch(err => {
                                        reject();
                                        enqueueSnackbar(err.toString(), {variant: 'error'})
                                    })
                                }
                            }))
                        toggleDeptSelectionDisplay()
                    }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise( (resolve, reject) => {
                            setState(oldState => ({
                                ...oldState,
                                selectedDept: oldData.deptId,
                                rejectCall: () => {
                                    reject();
                                },
                                callback: (selectedDept) => {
                                    toggleDeptSelectionDisplay()
                                    const { _id } = oldData
                                    const { title, level, classSize, year } = newData
                                    let query = `${API_URL}updateCourse?id=${_id}&title=${title}&level=${level}&classSize=${classSize}&year=${year}`
                                    console.log(selectedDept)
                                    if ( selectedDept.length > 0 && !(selectedDept.length === 1 && selectedDept[0] === ''))
                                        query += `&deptId[]=${selectedDept.join('&deptId[]=')}`

                                    axios.post(query)
                                    .then( res => {
                                        if (res.data.status) {
                                            setTimeout(() => {
                                                resolve();
                                                const data = [...state.data];
                                                newData.deptNames = res.data.deptNames.join(', ')
                                                data[data.indexOf(oldData)] = newData;
                                                setState({ ...state, data });
                                                enqueueSnackbar('Update success', {variant: 'success'})
                                            }, 600);
                                        } else {
                                            reject();
                                            enqueueSnackbar(res.data.err, {variant: 'error'})
                                        }
                                    })
                                    .catch(err => {
                                        reject();
                                        enqueueSnackbar(err.toString(), {variant: 'error'})
                                    })
                                }
                            }))
                        toggleDeptSelectionDisplay()
                    }),
                    onRowDelete: oldData =>
                        new Promise( (resolve, reject) => {
                            const { _id } = oldData
                            let query = `${API_URL}delCourse?id=${_id}`
                            axios.post(query)
                            .then( res => {
                                if (res.data.status) {
                                    setTimeout(() => {
                                        resolve();
                                        const data = [...state.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        setState({ ...state, data });
                                        enqueueSnackbar('Delete success', {variant: 'success'})
                                    }, 600);
                                } else {
                                    reject();
                                    enqueueSnackbar(res.data.err, {variant: 'error'})
                                }
                            })
                            .catch(err => {
                                reject();
                                enqueueSnackbar(err.toString(), {variant: 'error'})
                            })
                    }),
                }}
            />
            <Dialog open={state.isDeptSelectionDisplay}>
                <DialogTitle id="simple-dialog-title">Enrolled Student</DialogTitle>
                <DialogContent>
                <FormControl className={classes.departmentSelect}>
                    <InputLabel htmlFor="select-multiple">Select Department</InputLabel>
                    <Select
                        value={state.selectedDept}
                        onChange={handleSelectChange}
                        multiple
                        inputProps={{
                            name: 'selectedDept',
                            id: 'selectedDept',
                        }}
                    >   
                        <MenuItem value="">-- Please select --</MenuItem>
                    {
                        state.departments && (
                            state.departments.map( data => (
                                <MenuItem key={`info_${data._id}`} value={data._id}>{data.deptName}</MenuItem>
                            ))
                        )
                    }
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => toggleDeptSelectionDisplay(true)} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        variant="outlined" 
                        className={classes.button} 
                        onClick={() => state.callback(state.selectedDept)}
                    >
                        Submit 
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}