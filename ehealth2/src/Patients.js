import React, {Component} from 'react'
import axios from 'axios'
import { render } from 'react-dom';
import ReactPaginate from 'react-paginate';
import './App.css';
import ShowPatient from './ShowPatient';
import SearchField from "react-search-field";


export default class Patients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            data: [],
            perPage: 10,
            currentPage: 0
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);

    }

    handlePatient(bd) {
       render(<ShowPatient item={bd} />, document.getElementById('root'));
    }

    handleSearchPatient(bd) {

       render(<ShowPatient item={bd} />, document.getElementById('root'));
    }

    receivedData() {
        axios
            .get(`http://hapi.fhir.org/baseR4/Patient?_format=json&_pretty=true`)
            .then(res => {

                var data = []
                for (let i = 0; i < res.data.entry.length; i++) {
                    if (res.data.entry[i].resource && res.data.entry[i].resource.name) {
                        data.push(res.data.entry[i])
                    }
                }

                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                const postData = slice.map(pd => <React.Fragment>
                    <p onClick={() => this.handlePatient(pd)}>{pd.resource.name[0].family + " " + pd.resource.name[0].given}</p>
                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                })
            });
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });

    };

    receivedDataSearch(searchText) {
        axios
            .get(`http://hapi.fhir.org/baseR4/Patient?_format=json&_pretty=true`)
            .then(res => {

                var data = []
                for (let i = 0; i < res.data.entry.length; i++) {
                    if (res.data.entry[i].resource && res.data.entry[i].resource.name) {

                        if (res.data.entry[i].resource.name[0].family === searchText) {
                              data.push(res.data.entry[i])
                        }

                    }
                }

                const postData = data.map(pd => <React.Fragment>
                    <p onClick={() => this.handleSearchPatient(pd)}>{pd.resource.name[0].family + " " + pd.resource.name[0].given}</p>
                </React.Fragment>)
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                })
            });
    }

    handlePageChange = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedDataSearch(e)
        });

    };

    componentDidMount() {
        this.receivedData()
    }
    render() {

        return (
        <div>
            <div>
            <SearchField
              placeholder="Search..."
              onChange={this.handlePageChange}
              searchText=""
              classNames="test-class"
            />
            </div>
            <div id="paginate">
                {this.state.postData}
                <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
            </div>
        </div>
        )
    }
}
