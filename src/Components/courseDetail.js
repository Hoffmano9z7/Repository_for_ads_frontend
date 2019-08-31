import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import EnrollBtn from './enrollBtn';
import EnrolledStudent from './enrolledStudent';
import { useSnackbar } from 'notistack';

const API_URL = 'https://ads-enrollment-system.herokuapp.com/';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    columnMain: {
      flexBasis: '66.66%',
    },
    columnSub: {
      flexBasis: '33.33%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }));




export default function CourseDetails(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
      courseInfo: props.courseInfo,
      isUnEnroll: checkIsUneroll()
    });
    const { isUnEnroll } = values;
    const { _id, title, level, classSize, year, enrolled, department } = values.courseInfo;
    const availablePlace = !!enrolled ? classSize - enrolled.length : 0;

    useEffect(() => {
      setValues(oldValues => ({
        ...oldValues,
        courseInfo: props.courseInfo,
      }))
    }, [props.courseInfo]);

    const { enqueueSnackbar } = useSnackbar();

    function checkIsUneroll() {
      const stuId = localStorage.getItem('ads_hw_login')
      if (!!stuId && !!props.courseInfo.enrolled) {
        for (let i = 0; i < props.courseInfo.enrolled.length; i++) {
          const tempId = props.courseInfo.enrolled[i].stuId
          if (stuId === tempId)
            return true;
        }
        return false;
      } else {
        return false;
      }
    }

    function enrollCourse() {
      const stuId = localStorage.getItem('ads_hw_login')
      if (stuId) {
        let query = `?courseId=${_id}&stuId=${stuId}`
        axios.post(`${API_URL}enrollCourse${query}`)
        .then( res => {
          const { data } = res;
          if (!!data) {
            if (data.status) {
              setValues(oldValues => ({
                ...oldValues,
                courseInfo: {
                  _id: data.result._id,
                  title: data.result.title, 
                  deptId: data.result.deptId, 
                  level: data.result.level, 
                  classSize: data.result.classSize,
                  year: data.result.year,
                  enrolled: data.result.enrolled,
                  department: data.result.department,
                },
                isUnEnroll: true,
              }))
              
              enqueueSnackbar('Enroll success!', {variant: 'success'})
            } else {
              enqueueSnackbar(data.err, {variant: 'error'})
            }
          }
        })
        .catch(err => {
          enqueueSnackbar(err.toString(), {variant: 'error'})
        })
      } else {
        enqueueSnackbar('Please login first!', {variant: 'error'})
      }
    }

    function unenrollCourse() {
      const stuId = localStorage.getItem('ads_hw_login')
      if (stuId) {
        let query = `?courseId=${_id}&stuId=${stuId}`
        axios.post(`${API_URL}unenrollCourse${query}`)
        .then( res => {
            const { data } = res;
            if (!!data) {
              if (data.status) {
                setValues(oldValues => ({
                  ...oldValues,
                  courseInfo: {
                    _id: data.result._id,
                    title: data.result.title, 
                    deptId: data.result.deptId, 
                    level: data.result.level, 
                    classSize: data.result.classSize,
                    year: data.result.year,
                    enrolled: data.result.enrolled,
                    department: data.result.department,
                  },
                  isUnEnroll: false,
                }))
                enqueueSnackbar('Unenroll success!', {variant: 'success'})
                // props.unenrollCallBack(data.result._id);
              } else {
                enqueueSnackbar(data.err, {variant: 'error'})
              }
            }
        })
        .catch(err => {
          enqueueSnackbar(err.toString(), {variant: 'error'})
        })
      } else {
        enqueueSnackbar('Please login first!', {variant: 'error'})
      }
    }

    return (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <div className={classes.columnSub}>
                        <Typography className={classes.heading}><b>{title}</b></Typography>
                    </div>
                    <div className={classes.columnMain}>
                        <Typography className={classes.secondaryHeading}><b>Course ID:</b> {_id}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <div className={classes.columnMain}>
                        <Grid 
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                        >   
                          <Grid item xs={12}><b>Department:</b> {department.map( dept => dept.deptName).join(', ')}</Grid>
                          <Grid item xs={6}><b>Level:</b> {level}</Grid>
                          <Grid item xs={6}><b>Class Size:</b> {classSize}</Grid>
                          <Grid item xs={6}><b>Year:</b> {year}</Grid>
                          <Grid item xs={6}><b>Available Place:</b> {availablePlace}</Grid>
                        </Grid>
                    </div>
                    <div className={clsx(classes.columnSub, classes.helper)}>
                        <p><b>Enrolled Students:</b></p>
                        <EnrolledStudent enrolled={enrolled} />
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <EnrollBtn 
                  availablePlace={availablePlace} 
                  enrolled={enrolled} 
                  isUnEnroll={isUnEnroll}
                  func={isUnEnroll ? unenrollCourse : enrollCourse}
                />
            </ExpansionPanel>
        </div>
    )

}