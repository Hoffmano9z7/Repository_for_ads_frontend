import React, { useState, useEffect } from 'react';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Button from '@material-ui/core/Button';

export default props => {

    
    const [values, setValues] = useState({
        isUnEnroll: props.isUnEnroll,
        disabled: !props.isUnEnroll && props.availablePlace === 0,
    });
    const { isUnEnroll, disabled } = values;

    useEffect(() => {
        setValues(oldValues => ({
            ...oldValues,
            isUnEnroll: props.isUnEnroll,
            disabled: !props.isUnEnroll && props.availablePlace === 0,
        }))
    }, [props.availablePlace, props.isUnEnroll]);

    return (
        <React.Fragment>
            {   
                localStorage.getItem('ads_hw_login') !== "ads_admin" && (
                    <ExpansionPanelActions>
                        <Button size="small" color="primary" disabled={disabled} onClick={props.func}>
                            { isUnEnroll ? 'Unenroll' : 'Enroll' }
                        </Button>
                    </ExpansionPanelActions>  
                )
            }
        </React.Fragment>
    )
}