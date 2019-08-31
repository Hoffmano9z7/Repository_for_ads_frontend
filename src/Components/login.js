import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
    studentSelect: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    nameText: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 400,
    },
}));

export default props => {

    const classes = useStyles();
    const [values, setValues] = useState({
        students: [],
        selectedStu: !!localStorage.getItem('ads_hw_login') ? localStorage.getItem('ads_hw_login') : "",
        name: '',
    });

    const { enqueueSnackbar } = useSnackbar();

    function getStudent() {
        let query = `?name=${values.name}`
        axios.get(`${API_URL}getStudent${query}`)
        .then( res => {
            const { data } = res;
            if (!!data && data.length) {
                setValues(oldValues => ({
                    ...oldValues,
                    students: data,
                }))
            }
        })
        .catch(err => console.log(err))
    }

    function auth() {
        const { selectedStu } = values;
        if (selectedStu) {
            if (props.isLoggedIn) {
                localStorage.removeItem('ads_hw_login');
                props.setLoginStatus(false, 'ads_admin' === selectedStu);
            }
            else {
                localStorage.setItem('ads_hw_login', values.selectedStu);
                props.setLoginStatus(true, 'ads_admin' === selectedStu);
            }
            enqueueSnackbar(props.isLoggedIn ? "You have been logged out!" : "Login Success!", {variant: 'success'})
        } else {
            enqueueSnackbar("You have to select a student to login.", {variant: 'warning'})
        }
    }

    function handleSelectChange(event) {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    const handleTextFieldChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    useEffect( () => {
        if (values.name.length === 0 || values.name.length > 3)
            getStudent()
    }, [values.name]);

    return (
        <div hidden={props.hidden}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography gutterBottom className={classes.subject} variant="h3">
                        Login Page
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <p>
                        Filter the students by inputing more than 3 characters, then to please select a student to login.
                    </p>
                </Grid>
                <Grid container item direction="row" alignItems="flex-end" spacing={2} xs={12}>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            id="name"
                            label="Filter"
                            className={classes.nameText}
                            value={values.name}
                            onChange={handleTextFieldChange('name')}
                            margin="normal"
                            disabled={props.isLoggedIn}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl className={classes.studentSelect}>
                            <InputLabel>User</InputLabel>
                            <Select
                                value={values.selectedStu}
                                onChange={handleSelectChange}
                                inputProps={{
                                    name: 'selectedStu',
                                    id: 'selectedStu',
                                }}
                                disabled={props.isLoggedIn || values.students.length === 0}
                            >   
                                <MenuItem value="">-- Please select --</MenuItem>
                                <MenuItem value="ads_admin">System admin</MenuItem>
                                {values.students && (
                                    values.students.map( stu => (
                                        <MenuItem key={stu._id} value={stu._id}>{stu.stuName}</MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button 
                            variant="outlined" 
                            className={classes.button} 
                            onClick={auth}
                        >
                            {props.isLoggedIn ? 'Logout' : 'Login'} 
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}