import React, { Component } from 'react';
import 'cssPath/dropdown.css';
import PropTypes from 'prop-types';
import {getEvent } from 'basePath/views/component/common/crudoperation';
export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchData: [],
            isOpen: false,
            searchQuery: '',
            selectedData: []
        };
        this.dropdownRef = React.createRef();
    }
    //store data in session Storage for saving same query search
    saveDataIntoSessionStorage = (q, data) => {
        sessionStorage.setItem(q, data);
    };
    //get data from  session Storage
    getDatafromSessionStorage = (q) => {
        let data = sessionStorage.getItem(q);
        return data;
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.listenerCallback);
    }
    //maintaing outside click event
    listenerCallback = (e) => {
        if (this.dropdownRef && this.dropdownRef.current.contains(e.target)) return;
        this.setState(
            { isOpen: false, searchData: [], searchQuery: '', error: ''},
            () => {
                document.removeEventListener('click', this.listenerCallback);
            }
        );
    }
    //toggle suggestor dropdown
    toggleDropdown = () => {
        this.setState(
            prevState => ({
                isOpen: !prevState.isOpen
            }),
            () => {
                if (this.state.isOpen) {
                    window.addEventListener('click', this.listenerCallback);
                }
            }
        );
    }
    renderSingleSelect = () => {
        const { searchData } = this.state;
        const { displayId, displayValue, EmptyMsg} = this.props;
        return (
            <ul className='mainUl'>
                {!searchData ||searchData.length === 0 ? (
                    <span>{EmptyMsg}</span>
                ) : (
                    searchData.map((item, index) => (
                        <li
                            key={index}
                            id={`item-${item[displayId]}`}
                            onClick={() => this.onSingleSelectListItem(item)}
                            className={'list-item'}
                        >
                            {item[displayValue]}
                        </li>
                    ))
                )}
            </ul>
        );
    }
    onSingleSelectListItem = item => {
        const { displayId, displayValue} = this.props;
        let selectedData = this.state.selectedData;
        let error = ''
        for(let obj of selectedData){
            if(obj[displayId] == item[displayId]){
                error = `${item[displayValue]} is already selected`;
                break;
            }
        }
        if(error.length > 0){
            this.setState({
                error: error
            });
        } else {
            selectedData.push(item);
            this.setState({
                selectedData: selectedData,
                searchData: [],
                searchQuery: '',
                error: ''
            });
            this.toggleDropdown();
        }
        
    }
    //search Method for Giving Query
    searchMethod = () => {
        let data = this.getDatafromSessionStorage(this.state.searchQuery);
        if(!data) {
            let that = this;
            let  url = this.props.searchUrl(this.state.searchQuery);
            getEvent(url)
            .then(res => {
                if(res.data && res.data.Search){
                    that.saveDataIntoSessionStorage(this.state.searchQuery, JSON.stringify(res.data.Search));
                }
                that.setState({
                    searchData: res.data.Search,
                    isOpen: true
                }, () => {
                    window.addEventListener('click', this.listenerCallback);
                });
            })
            .catch(err => console.log(err));
        } else {
            this.setState({
                searchData: JSON.parse(data),
                isOpen: true
            });
        }
    }
    debounceWrapper = function(fn, delay) {
        return function(...args) {
            var that = args[0];
            clearTimeout(that.timer);
            that.timer = setTimeout(() => {
                fn.apply(that);
            }, delay);
        };
    };
    onChange = (event) => {
        this.setState({
                searchQuery: event.target.value
            }, () => {
                this.debounceWrapper(this.searchMethod, 300)(this);
            }
        );
    }
    //dropDownMethod
    removeSelectedOptions = (e, id) => {
        const { displayId} = this.props;
        let selectedData = this.state.selectedData;
        for(let index in selectedData){
            if(selectedData[index][displayId] == id){
                selectedData.splice(index, 1);
                this.setState({
                    selectedData: selectedData
                });
                break;
            }
        }
    }
    render() {
        const { displayId, displayValue, maxSelection} = this.props;
        return (
            <div className={`dropdowncomponent`} ref={this.dropdownRef}>
                <div className="heading">
                    {this.state.error && (
                        <span className="error">{this.state.error}</span>
                    )}
                    <div className="input_wrapper">
                        {this.state.selectedData.map((item, index) => (
                                <div className="selected_tag" key={index}>
                                    <span key={item[displayValue]}>
                                        {item[displayValue]}
                                        <a className="close" onClick={event => this.removeSelectedOptions(event, item[displayId])}>
                                            &#x2715;
                                        </a>
                                    </span>
                                </div>
                            )
                        )}
                        
                        <input
                            type="text"
                            className={`heading-input`}
                            onChange={this.onChange}
                            value={this.state.searchQuery}
                            placeholder={this.props.placeholder}
                            autoComplete="off"
                            readOnly={this.state.selectedData.length < maxSelection ? false : true}
                            id={'id_movie_search'}
                        />
                    </div>
                    {this.state.isOpen && this.renderSingleSelect()}
                </div>
                
            </div>
        );
    }
}

Dropdown.propTypes = {
    placeholder: PropTypes.string,
    displayId: PropTypes.string,
    displayValue: PropTypes.string,
    maxSelection: PropTypes.number,
    EmptyMsg: PropTypes.string
};

Dropdown.defaultProps = {
    placeholder: '',
    displayId: '',
    displayValue: '',
    maxSelection: 5,
    EmptyMsg: 'No Content Found'
};
