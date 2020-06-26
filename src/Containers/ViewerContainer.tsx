import React, { useState, useEffect } from 'react'
import API from '../API';
import { InfoOverlay } from '../Components/InfoOverlay'
import Image from 'react-graceful-image'
import BackButton from '../Components/BackButton'
import { Link } from 'react-router-dom'

interface ViewerContainerProps {
    history: any;
    match: any;
}

interface ImageData {
    image: {
        id: string;
        title: string;
        url: string;
    }
    album: {
        id: string;
        title: string;
    };
}

interface LoadingState {
    loading: boolean;
}

export const ViewerContainer:  React.FC<ViewerContainerProps> = (props: ViewerContainerProps) => {

    const [imageData, setImageData] = useState<ImageData>({
        image: {
            id: "",
            title: "",
            url: "",
        },
        album: {
            id: "",
            title: "",
        }
    });

    const [loadingState, setLoadingState] = useState<LoadingState>({
        loading: true
    });

    useEffect(() => {

        const getImageData = async () => {  
            await API
            .get(`/photos/${props.match.params.id}`)
            .then(async response => {
                await API
                .get(`/albums/${response.data.albumId}`)
                .then(albumResponse => {
                    setImageData({
                        image: response.data,
                        album: albumResponse.data
                    })
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                setLoadingState({loading: false});              
            });

        }

        getImageData();
    }, [props.match.params.id]) 

    return (
        <div className="container">
            {
                loadingState.loading ? (
                    <InfoOverlay text="Please wait..." icon="loadingSpinner"/>
                ) : (
                    imageData.image.id ?  (
                    <div>
                        <div className="row">
                            <Image className="imageView"
                                src={imageData.image.url} 
                                width='600' height='600' 
                                alt={imageData.image.id}
                                placeholderColor='#393d3a'/>    
                            
                        </div>
                        <div className="row description">
                            <div className="descriptionRow">
                                <div className="descriptionKey">Title</div>
                                <div className="descriptionValue"> 
                                    {imageData.image.title}
                                </div>
                                </div>
                            <div className="descriptionRow">
                                <div className="descriptionKey">Album</div>
                                <Link to={"/gallery?albumId="+imageData.album.id} className="descriptionValue link"> 
                                    {imageData.album.title}
                                </Link>
                            </div>  
                            <div className="descriptionRow">
                                <BackButton/>
                            </div>           
                            
                        </div>
                    </div>
                    ) : (
                        <InfoOverlay text="Unable to fetch data" icon="failureIcon"/>
                    )
                )
            }
        </div>
    )   
}
