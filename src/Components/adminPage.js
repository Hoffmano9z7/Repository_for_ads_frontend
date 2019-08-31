import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import StudentManagement from './studentManagement';
import DepartmentManagement from './departmentManagement';
import CourseManagement from './courseManagement';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    subject: {
        paddingTop: '50px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    details: {
        alignItems: 'center',
    },
    panelTitle: {
        flexBasis: '100%',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default props => {

    const classes = useStyles();
    const [state, setState] = useState({
        isStudentPageHidden: true,
        isDeptPageHidden: true,
    });

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography gutterBottom className={classes.subject} variant="h3">
                    Admin Page
                </Typography>
            </Grid>
            <Grid container item direction="row" alignItems="flex-end" spacing={3} xs={12}>
                <div className={classes.root}>
                    <Grid item xs={12} sm={12} className={classes.margin} >
                        <StudentManagement />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.margin} >
                        <DepartmentManagement />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.margin} >
                        <CourseManagement />
                    </Grid>
                </div>
            </Grid>
        </Grid>
    )
}