import React from 'react';
import { withRouter } from 'react-router-dom';

interface IBackButtonProps {
    history: any;
}

const BackButton: React.FC<IBackButtonProps> = (props: IBackButtonProps) => (
    <div className="button" onClick={props.history.goBack}>
        Back to gallery       
    </div>
);
    
export default withRouter(BackButton);


