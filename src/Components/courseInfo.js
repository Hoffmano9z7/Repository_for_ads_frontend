import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CourseDetails from './courseDetail';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import { useSnackbar } from 'notistack';

const API_URL = 'https://ads-enrollment-system.herokuapp.com/';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    subject: {
        paddingTop: '50px',
    },
    yearSelect: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    departmentSelect: {
        margin: theme.spacing(1),
        minWidth: 400,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function CourseInfo() {
    const classes = useStyles();
    const [values, setValues] = useState({
        departments: [],
        year: '',
        selectedDept: [],
        courseInfo: [],
        isSortByPop: false,
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        axios.get(`${API_URL}getDepartment`)
        .then( res => {
            const { data } = res;
            if (!!data) {
                setValues(oldValues => ({
                    ...oldValues,
                    departments: data,
                }))
                data.length === 0 && enqueueSnackbar('No department found!', {variant: 'warning'})
            }
        })
        .catch(err => {
            enqueueSnackbar(err.toString(), {variant: 'error'})
        })
    }, []);

    function getYearList() {
        return [0, 1, 2, 3, 4].map( data => {
            const y = new Date().getFullYear() - data;
            return (
                <MenuItem value={y} key={`year_${y}`}>{y}</MenuItem>
            )
        })
    }

    function handleSelectChange(event) {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    function handleSwitchChange(stateKey) {
        setValues(oldValues => ({
            ...oldValues,
            [stateKey]: !oldValues[stateKey],
        }));
    };

    function searchCourseInfo() {
        const { year, selectedDept, isSortByPop } = values;
        const FUNC = isSortByPop ? 'getCourseInfoSortedByPop' : 'getCouseInfo';

        let query = `?year=${year}`
        if ( selectedDept.length > 0 && !(selectedDept.length === 1 && selectedDept[0] === ''))
            query += `&deptId[]=${selectedDept.join('&deptId[]=')}`
            
        axios.get(`${API_URL}${FUNC}${query}`)
        .then( res => {
            const { data } = res;
            if (!!data) {
                setValues(oldValues => ({
                    ...oldValues,
                    courseInfo: data,
                }))
                data.length === 0 && enqueueSnackbar('No course found!', {variant: 'info'})
            }
        })
        .catch(err => {
            enqueueSnackbar(err.toString(), {variant: 'error'})
        })
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography gutterBottom className={classes.subject} variant="h3">
                    Course Information
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <p>
                    Select the following fields to add search criteria.
                </p>
            </Grid>
            <Grid container item direction="row" alignItems="flex-end" spacing={2} xs={12}>
                <Grid item xs={12} sm={3}>
                    <FormControl className={classes.yearSelect}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={values.year}
                            onChange={handleSelectChange}
                            inputProps={{
                                name: 'year',
                                id: 'year',
                            }}
                        >   
                            <MenuItem value="">-- Please select --</MenuItem>
                            { getYearList() }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <FormControl className={classes.departmentSelect}>
                        <InputLabel htmlFor="select-multiple">Department</InputLabel>
                        <Select
                            value={values.selectedDept}
                            onChange={handleSelectChange}
                            multiple
                            inputProps={{
                                name: 'selectedDept',
                                id: 'selectedDept',
                            }}
                        >   
                            <MenuItem value="">-- Please select --</MenuItem>
                        {
                            values.departments && (
                                values.departments.map( data => (
                                    <MenuItem key={`info_${data._id}`} value={data._id}>{data.deptName}</MenuItem>
                                ))
                            )
                        }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        control={
                        <Switch
                            checked={values.isSortByPop}
                            onChange={() => handleSwitchChange('isSortByPop')}
                        />
                        }
                        label="Sort by popularity"
                    />
                </Grid>
            </Grid>
            <Grid 
                item 
                sm={10}
                xs={12} 
                container direction="row"
                justify="flex-end"
                alignItems="flex-end"
            >
                <Button 
                    variant="outlined" 
                    className={classes.button} 
                    onClick={searchCourseInfo}
                >
                    Search 
                </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Divider />
            </Grid>
            <Grid item container xs={12} sm={12} spacing={1}>
                    { values.courseInfo.length > 0 && (
                        values.courseInfo.map( (info, index) => (
                            <Grid item key={'courseInfo_' + index} xs={12} sm={9}>
                                <CourseDetails courseInfo={info}  />
                            </Grid>
                        ))
                    ) }
            </Grid>
        </Grid>
    )
}