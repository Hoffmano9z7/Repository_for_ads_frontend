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
import dayjs from 'dayjs'

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

export default () => {

    const [state, setState] = useState({
        columns: [
            { title: 'Student ID', field: '_id', editable: 'never' },
            { title: 'Student Name', field: 'stuName' },
            { title: 'Date of Birth', field: 'dob' },
        ],
        data: [],
        isLoading: true,
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        axios.get(`${API_URL}getStudent`)
        .then( res => {
            const { data } = res;
            if (!!data) {
                setState(oldState => ({
                    ...oldState,
                    data: data.map( stu => {
                        stu.dob = dayjs(stu.dob).format('YYYY-MM-DD')
                        return stu
                    }),
                    isLoading: false,
                }))
            }
        })
        .catch(err => {
            enqueueSnackbar(err.toString(), {variant: 'error'})
        })
    }, []);

    return (
        <MaterialTable
            title="Student Management"
            isLoading={state.isLoading}
            icons={tableIcons}
            columns={state.columns}
            data={state.data}
            options={{
                actionsColumnIndex: -1
            }}
            editable={{
                onRowAdd: newData =>
                    new Promise( (resolve, reject) => {
                        const { stuName, dob } = newData
                        axios.post(`${API_URL}addStudent?stuName=${stuName}&dob=${dob}`)
                        .then( res => {
                            if (res.data.status) {
                                setTimeout(() => {
                                    resolve();
                                    const data = [...state.data];
                                    newData._id = res.data.id
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
                }),
                onRowUpdate: (newData, oldData) =>
                    new Promise( (resolve, reject) => {
                        const { _id } = oldData
                        const { stuName, dob } = newData
                        axios.post(`${API_URL}updateStudent?id=${_id}&stuName=${stuName}&dob=${dob}`)
                        .then( res => {
                            if (res.data.status) {
                                setTimeout(() => {
                                    resolve();
                                    const data = [...state.data];
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
                }),
                onRowDelete: oldData =>
                    new Promise( (resolve, reject) => {
                        const { _id } = oldData
                        axios.post(`${API_URL}delStudent?id=${_id}`)
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
    )
}