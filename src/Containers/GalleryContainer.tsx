import React, { useState, useEffect } from 'react'
import { PaginationBar } from '../Components/PaginationBar'
import { InfoOverlay } from '../Components/InfoOverlay'
import { ThumbnailImage } from '../Components/ThumbnailImage'
import queryString from 'query-string';
import API from '../API';
var _ = require('lodash');

// Default fallback limit
const LIMIT = 40;

interface GalleryContainerProps {
    history: any;
    match: any;
    location: any;
}

export interface QueryParams {
    _page?: number;
    _limit?: number;
    albumId?: string;
}

interface ImageNode {
    id: string;
    title: string;
    thumbnailUrl: string;
    albumId: string;
}

interface ThumbnailData {
    thumbnails: ImageNode[];
    totalCount: number;
}

interface LoadingState {
    loading: boolean;
}

export const GalleryContainer: React.FC<GalleryContainerProps> = (props: GalleryContainerProps) => {

    const [thumbnailData, setThumbnailData] = useState<ThumbnailData>({
        thumbnails: [],
        totalCount: 1
    });

    const [queryData, setQueryData] = useState<QueryParams>( {       
        _page: 1,
        _limit: LIMIT,
        albumId: ""    
    });

    const [loadingState, setLoadingState] = useState<LoadingState>({
        loading: true
    });

    // Fetch thumbnails when search parameters change
    useEffect(() => {
       
        const getThumbnails = async () => {   
            setLoadingState({loading: true});
            
            let queryParams : QueryParams = {       
                _page: 1,
                _limit: LIMIT,
                albumId: ""    
            };
            _.assign(queryParams , _.pick(queryString.parse(props.location.search), _.keys(queryParams)));
            const queryStr = "?" + queryString.stringify(queryParams, {skipEmptyString: true, skipNull: true});     
            
            await API
            .get(`/photos${queryStr !== "?" ? queryStr : ""}`)
            .then(response => {
                setThumbnailData({
                    thumbnails: response.data,
                    totalCount: response.headers["x-total-count"]
                });
                setQueryData(queryParams);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                setLoadingState({loading: false});
            });
        }

        getThumbnails();

    }, [props.location.search]) 

    return  (
        <div className="container">
            {
                loadingState.loading ? (
                    <InfoOverlay text="Please wait..." icon="loadingSpinner"/>
                ) : (
                    thumbnailData.thumbnails.length > 0 ? (
                        <div>
                            <div className="row galleryGrid">
                                {
                                    thumbnailData.thumbnails.map((value: ImageNode, index: number) => 
                                        <ThumbnailImage
                                            id={value.id}
                                            url={value.thumbnailUrl}
                                            alt={value.id}
                                            title={value.title}
                                            key={index}
                                        />)
                                }                          
                            </div>
                            
                            <PaginationBar 
                                queryData={queryData}
                                totalPages={Math.ceil(thumbnailData.totalCount / (queryData._limit || LIMIT))}
                                path='/gallery'
                            />
                            
                        </div>
                    ) : (
                        <InfoOverlay text="Unable to fetch data" icon="failureIcon"/>
                    )
                )
            }
        </div>
            
    )
}