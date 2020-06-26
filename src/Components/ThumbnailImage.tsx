import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-graceful-image';

interface ThumbnailImageProps {
    id: string;
    alt: string;
    url: string;
    title: string;
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = (props: ThumbnailImageProps) => {

    const [hovered, bindHover] = useHover();

    return (
        <Link to={"/view/"+props.id}>
            <Image className="thumbnail" 
                src={props.url} 
                width='150' height='150' 
                alt={props.alt}
                placeholderColor='#393d3a'/>
                              
                <div {...bindHover} className="titleCard" style={{display: hovered ? 'block' : 'none'}}>
                    {props.title}
                </div>
                                               
        </Link>
    );
}

const useHover = () => {
    const [hovered, set] = useState(false);
    const binder = {
      onMouseEnter: () => set(true),
      onMouseLeave: () => set(false)
    };
    return [hovered, binder];
  }
