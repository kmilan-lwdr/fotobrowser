import React from 'react';

interface OverlayProps {
    text: string;
    icon: string;
}

export const InfoOverlay: React.FC<OverlayProps> = (props: OverlayProps) => {
    return (
        <div className="overlay">
            <div className="text">
                {props.text}
                <div className={props.icon}/>
            </div>                              
        </div>
    );
}
