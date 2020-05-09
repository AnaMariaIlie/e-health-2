import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class ShowPatient extends Component {


    constructor(props) {
        super(props);
        this.state = {
            encounters: {
            entry: [{
            resource: {
            subject:{},
            location:[{
            location:{},
            period:{}}]}}]},

            carePlan: {
            entry:[{
            resource: {
            activity: [{
            detail: {
            code:{}}}]}}]}
        };

    }

     getEncounters(id) {
            axios
                .get('http://hapi.fhir.org/baseR4/Encounter?_format=json&_pretty=true&patient='+ id)
                .then(res => {

                    if (res.data && res.data.total > 0 && res.data.entry) {
                        this.setState({
                            encounters: res.data
                        })
                    }

                    //console.log(this.state.encounters.entry[0])

                });
     }

    getCarePlan(id) {
            axios
                .get('http://hapi.fhir.org/baseR4/CarePlan?_format=json&_pretty=true&patient='+ id)
                .then(res => {

                    if (res.data && res.data.total > 0 && res.data.entry) {
                        this.setState({
                            carePlan: res.data
                        })
                    }

                    console.log(this.state.carePlan)

                });
     }

     componentDidMount() {
         this.getEncounters(this.props.item.resource.id)
         this.getCarePlan(this.props.item.resource.id)
     }

    render() {

        return (
            <div class="container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">
                            Patient Details
                        </h3>
                    </div>
                    &emsp;
                    <div class="panel-body">
                        <dl>
                            <dt>Name:</dt>
                            <dd>{this.props.item.resource.name[0].family}</dd>
                            <dt>Encounters:</dt>
                            <dd>{this.state.encounters.entry.map(x => <small> {x.resource.subject.reference + '\nLocations:\n' +
                            x.resource.location.map(loc => "Location: " + loc.location.display) +'\n'} </small>)}</dd>
                            <dt>Care plan:</dt>
                            <dd>{this.state.carePlan.entry.map(x => <small> {'\nActivities:\n' +
                            x.resource.activity.map(act => "Activity: " + act.detail.code.text) +'\n'} </small>)}</dd>

                        </dl>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShowPatient;