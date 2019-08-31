import React, { useState, forwardRef, useEffect } from 'react';
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
import axios from 'axios';
import { useSnackbar } from 'notistack';

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

export default props => {

    const [state, setState] = useState({
        columns: [
            { 
                title: 'Student ID', 
                field: 'stuId',
                lookup: props.stuMap,
            },
            { 
                title: 'Student Name', 
                field: 'stuName',
                editable: 'never',
            },
        ],
        data: props.enrolled,
        classSize: props.classSize,
        isLoading: false,
    });

    const { enqueueSnackbar } = useSnackbar();

    return (
        <MaterialTable
            title={`Enrolled Student of ${props.courseTitle}`}
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                paging: false,
                search: false,
            }}
            isLoading={state.isLoading}
            columns={state.columns}
            data={state.data}
            editable={{
                onRowDelete: oldData =>
                    new Promise( (resolve, reject) => {
                        const { stuId } = oldData
                        axios.post(`${API_URL}unenrollCourse?courseId=${props.courseId}&stuId=${stuId}`)
                        .then( res => {
                            if (res.data.status) {
                                setTimeout(() => {
                                    resolve();
                                    setState(oldState => ({
                                        ...oldState,
                                        data: res.data.result.enrolled,
                                        isLoading: false,
                                    }))
                                    props.updatePlace(props.courseId, 1)
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
                onRowAdd: newData =>
                    new Promise( (resolve, reject) => {
                        const { stuId } = newData
                        axios.post(`${API_URL}enrollCourse?courseId=${props.courseId}&stuId=${stuId}`)
                        .then( res => {
                            if (res.data.status) {
                                setTimeout(() => {
                                    resolve();
                                    setState(oldState => ({
                                        ...oldState,
                                        data: res.data.result.enrolled,
                                        isLoading: false,
                                    }))
                                    props.updatePlace(props.courseId, -1)
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
                }),
            }}
        > 
        </MaterialTable>
            
    )
}