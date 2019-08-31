import React, { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import CourseInfo from './Components/courseInfo';
import EnrolledCourse from './Components/enrolledCourse';
import Login from './Components/login';
import AdminPage from './Components/adminPage';
import logo from './Img/logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  stepper: {
    position: 'fixed',
    left: '20px',
    top: '40%',
    zIndex: 100,
  },
  logo: {
    position: 'fixed',
    left: '20px',
    top: '20px',
  }
}));

export default function App() {

  const classes = useStyles();
  const adminPages = ['Login Page', 'Course Information', 'Admin Page'];
  const stuPages = ['Login Page', 'Course Information', 'Enrolled Course'];
  const [values, setValues] = useState({
    isLoggedIn: !!localStorage.getItem('ads_hw_login'),
    isAdmin: localStorage.getItem('ads_hw_login') === 'ads_admin',
    activeStep: 0,
    pages: !!localStorage.getItem('ads_hw_login') ? (localStorage.getItem('ads_hw_login') === 'ads_admin' ? adminPages : stuPages) : ['Login Page']
  });


  function goToStep(value) {
    setValues(oldValues => ({
      ...oldValues,
      activeStep: value,
    }));
  }

  function setLoginStatus(isLoggedIn, isAdmin) {
    let pages = ['Login Page'];
    if (isLoggedIn) {
      if (isAdmin)
        pages.push('Course Information', 'Admin Page');
      else 
        pages.push('Course Information', 'Enrolled Course');
    }

    setValues(oldValues => ({
      ...oldValues,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      pages: pages
    }));
  }

  return (
    <SnackbarProvider className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <img src={logo} className={classes.logo}/>
          <div className={classes.stepper}> 
            <Stepper activeStep={values.activeStep} orientation="vertical" nonLinear>
              {values.pages.map((label, index) => (
                <Step key={label} onClick={() => goToStep(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </Grid>
        <Grid item xs={12} sm={10}> 
          <Login hidden={values.activeStep !== 0 } setLoginStatus={setLoginStatus} isLoggedIn={values.isLoggedIn}/>
          { values.isLoggedIn && values.activeStep === 1 && <CourseInfo /> }
          { values.isLoggedIn && values.activeStep === 2 && !values.isAdmin && <EnrolledCourse hidden={!values.activeStep === 2}/> }
          { values.isLoggedIn && values.activeStep === 2 && values.isAdmin && <AdminPage hidden={!values.activeStep === 2}/> }
        </Grid>
      </Grid>
    </SnackbarProvider>
  );
}