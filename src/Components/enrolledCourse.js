import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CourseDetails from './courseDetail';
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

    nameText: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 400,
    },
}));

export default function EnrolledCourse(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        students: [],
        name: '',
        courseInfo: [],
    });

    const { enqueueSnackbar } = useSnackbar();

    function getEnrolledCourse(stuId) {
        let query = `?stuId=${stuId}`
        axios.get(`${API_URL}getEnrolledCourse${query}`)
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

    // async function getNewCourseList(oldList, courseId) {
    //     const result = oldList.filter( data => data._id !== courseId);
    //     return result
    // }

    function unenrollCallBack(courseId) {
        // return setValues(oldValues => ({
        //     ...oldValues,
        //     courseInfo: getNewCourseList(oldValues.courseInfo, courseId)
        // }))
    }

    useEffect( () => {
        const stuId = localStorage.getItem('ads_hw_login');
        if (stuId)
            getEnrolledCourse(stuId)
        else 
            enqueueSnackbar('Please login first!', {variant: 'warning'})
            
    }, [values.students]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography gutterBottom className={classes.subject} variant="h3">
                    Enrolled Course
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Divider />
            </Grid>
            <Grid item container xs={12} sm={12} spacing={1}>
                { values.courseInfo && (
                    values.courseInfo.map( (info, index) => (
                        <Grid item key={'enrolledCourse_' + index} xs={12} sm={9}>
                            <CourseDetails courseInfo={info} isUnEnroll={true} unenrollCallBack={unenrollCallBack} />
                        </Grid>
                    ))
                ) }
            </Grid>
        </Grid>
    )
}