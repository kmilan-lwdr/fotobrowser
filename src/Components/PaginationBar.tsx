import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import queryString from 'query-string';
import { QueryParams } from '../Containers/GalleryContainer';
var _ = require('lodash');

const NEIGHBOURS = window.innerWidth <= 760 ? 1 : 2;
const START = '|<';
const PREVIOUS = '<';
const NEXT = '>';
const END = '>|';
const BREAK = '...';

interface PaginationBarProps {
    queryData: QueryParams;
    totalPages: number;
    path: string;
}

interface Pages {
    pages: string[]
}

export const PaginationBar: React.FC<PaginationBarProps> = (props: PaginationBarProps) => {

    const [pages, setPages] = useState<Pages>({pages: []});   

    useEffect(() => {

        const generateButtonArray =  (currentPage: number, totalPages: number) => {   
    
            let buttons : string[] = [];
            
            // If current page is not the first, add "start" and "previous" buttons before the numbered buttons
            if (currentPage > 1 ){
                buttons.push(START);
                buttons.push(PREVIOUS);
            }
    
            // Visible page numbers
            let start = Math.max(1, currentPage - NEIGHBOURS);
            let end = Math.min(totalPages, currentPage + NEIGHBOURS);
            let visiblePages = 1 + 2 * NEIGHBOURS;

            // Add ... when first page number not visible
            if(start > 1)
            {
                buttons.push(BREAK);
            }
    
            // Always show max visible page numbers if totalPages exceeds it
            if(end < visiblePages && totalPages >= visiblePages)
            {
                end = Math.min(visiblePages, currentPage + 1 + NEIGHBOURS * 2);
            }
            if(start > totalPages  - NEIGHBOURS * 2)
            {
                start = Math.max(1, totalPages  - NEIGHBOURS * 2)
            }
    
            buttons = buttons.concat(_.range(start, end+1));
    
            // Add ... when last page number not visible
            if(end < totalPages)
            {
                buttons.push(BREAK);
            }
    
            // If current page is not the last, add "end" and "next" -buttons after the numbered buttons
            if (currentPage < totalPages){
                buttons.push(NEXT);
                buttons.push(END);
            }
            
    
            return buttons;
        }
        const pageData = generateButtonArray(Number(props.queryData._page) || 1, Number(props.totalPages));
        setPages({pages: pageData});

    }, [props.queryData._page, props.totalPages]) 

    return (
        <div className="row centered paginationBar">
            {
                pages.pages.map((page: string, index: number) => {
                    let pageNo;
                    const queryPage : number = Number(props.queryData._page) || 1;
                    switch(page)
                    {
                        case START:
                            pageNo = 1;
                            break;
                        case PREVIOUS:
                            pageNo = queryPage - 1;
                            break;
                        case NEXT:
                            pageNo = queryPage + 1;
                            break;
                        case END:
                            pageNo = props.totalPages;
                            break;
                        case BREAK:
                            return (
                                <span key={index} className="break">{page}</span>
                            );
                        default:
                            pageNo = page;
                    }
                    
                    return (
                        <Link 
                            to={props.path + "?" + queryString.stringify({...props.queryData, _page: pageNo})} 
                            key={index} 
                            className={`button ${props.queryData._page === pageNo ? 'active' : ''}`} >
                            {page}
                        </Link>
                    );
                })
            }

        </div>
    );
    
}
