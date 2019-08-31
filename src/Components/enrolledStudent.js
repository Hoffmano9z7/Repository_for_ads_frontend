import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(1),
    },
}));

export default props => {
    const classes = useStyles();
    const [values, setValues] = useState({
        isFullListShow: false,
        enrolled: props.enrolled,
    });

    function toggleFullListShow() {
        setValues(oldValues => ({
            ...oldValues,
            isFullListShow: !oldValues.isFullListShow,
        }))
    }

    const { enrolled } = values;

    useEffect(() => {
        setValues(oldValues => ({
            ...oldValues,
            enrolled: props.enrolled,
        }))
    }, [props.enrolled]);

    return (
        <React.Fragment>
            <List dense>
                {   
                    !!enrolled && ( enrolled.length > 3 ? enrolled.slice(0,3) : enrolled ).map( (data, index) => (
                        <ListItem key={`${data.stuId}_${data.enrolledDate}`}>
                            <ListItemText
                                primary={data.stuName}
                            />
                        </ListItem>
                    ))
                }
                {
                    !!enrolled && enrolled.length === 0 && (
                        <span>No students enrolled.</span>
                    )
                }
            </List>
            {
                (!!enrolled && enrolled.length > 3) && (
                    <React.Fragment>
                        <IconButton aria-label="more" className={classes.margin} onClick={toggleFullListShow}>
                            <MoreHorizIcon fontSize="small" />
                        </IconButton>
                        <Dialog onClose={toggleFullListShow} aria-labelledby="simple-dialog-title" open={values.isFullListShow}>
                            <DialogTitle id="simple-dialog-title">Enrolled Student</DialogTitle>
                            <DialogContent>
                                <List dense>
                                    { 
                                        enrolled.map( data => (
                                            <ListItem key={`${data.stuId}_${data.enrolledDate}`}>
                                                <ListItemText
                                                    primary={data.stuName}
                                                />
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </DialogContent>
                        </Dialog>
                    </React.Fragment>
                )
            }
      </React.Fragment>
    )
}