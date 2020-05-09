import React, {Component} from 'react'
import axios from 'axios'
import { render } from 'react-dom';
import ReactPaginate from 'react-paginate';
import './App.css';


export default class Medication extends Component {
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

    receivedData() {
        axios
            .get(`http://hapi.fhir.org/baseR4/Medication?_format=json&_pretty=true`)
            .then(res => {

                var data = []
                for (let i = 0; i < res.data.entry.length; i++) {
                        data.push(res.data.entry[i])
                }

                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(data)

                const postData = slice.map(pd => <React.Fragment>
                    <p>{pd.resource.code.coding[0].display}</p>
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

    componentDidMount() {
        this.receivedData()
    }

    render() {

        return (
            <div id="paginate-med">
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
        )
    }
}
