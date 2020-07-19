import React from 'react';
import Dropdown from 'basePath/views/component/common/DropDown';

export default class Movies extends React.Component{

    searchUrl = (query) => {
        let  url = `https://omdbapi.com/?apikey=b20d079f&type=movie&page=1&s=${query}`
        return url;
    }
    render() {
        return (
            <React.Fragment>
                <div>
                <span style={{marginLeft: '43%', marginTop: '7%', position: 'absolute'}}>
                        <strong>Movie Title</strong>
                    </span>
                    <Dropdown 
                        placeholder='Search Movies' 
                        displayId='imdbID' 
                        displayValue='Title' 
                        maxSelection={5} 
                        searchUrl={this.searchUrl}
                    />
                </div>
            </React.Fragment>
        );
    }
}
