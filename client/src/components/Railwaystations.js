import React, { Component } from 'react';
import api from '../api';
import { Link, Route } from 'react-router-dom';
import './Railwaystations.css'

import SearchBar from './SearchBar';
import MapContainer from './MapContainer';
import { Button, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import Favorites from './Favorites';
import RailwaystationDetail from './RailwaystationDetail';
import './Railwaystations.css'




class Railwaystations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      railwaystations: [],
      value: "",
      showMap: true,

    }
    this.handleToUpdate = this.handleToUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleToUpdate(args) {
    console.log("DEBUG handleToUpdate")
    this.setState(prevState => ({
      showMap: !prevState.showMap
    }));
  }

  handleChange(event) {

    let value = event.target.value
    this.setState({ value: value });
    let comparator = value.toUpperCase();

    let cities = [];
    for (let i = 0; i < this.state.railwaystations.length; i++) {
      cities.push(this.state.railwaystations[i].address.city);
    }

    let resultField = cities.map(function (elt) { return elt.toUpperCase() })
    let stateField = [];
    for (let i = 0; i < this.state.railwaystations.length; i++) {
      if (comparator === resultField[i]) {
        console.log("MATCH", resultField[i])
        stateField.push(this.state.railwaystations[i])
        console.log(stateField);
      }
    }

  }

  componentDidMount() {
    api.getRailwaystations()
      .then(railwaystations => {
        railwaystations.sort(
          function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); }
        );
        this.setState({
          railwaystations: railwaystations,
        })
      })
      .catch(err => console.log(err))
  }

  render() {

    let handleToUpdate = this.handleToUpdate;

    let filteredStations = this.state.railwaystations
      .filter(railwaystation => railwaystation.name.toUpperCase().includes(this.state.value.toUpperCase()))

    let isMap = this.state.showMap;
    let display;

    if (!isMap) {
      display =
        <React.Fragment>
          <Row>
            <Col>
              <Route path="/stations/:id" component={RailwaystationDetail} />
            </Col>
          </Row>
          <React.Fragment>
            <Row>

            {/* {<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 text-center"> */}
              <ul class="list-group-horizontal" className="list-group-horizontal">
                {filteredStations
                  .map((e) =>
                    <li class="list-group-item" key={e._id}><Link to={"/stations/" + e._id}>{e.name}</Link></li>)}
              </ul>
            {/* </div> } */}
            </Row>
          </React.Fragment>

          <Row>
            <Col>
              {api.isLoggedIn() && <Favorites />}
            </Col>
          </Row>
        </React.Fragment>



    } else {
      display =
        <React.Fragment>
          <React.Fragment>
            <Row>
              <Col>
                <div id="map-container"><MapContainer stations={filteredStations} />;</div>
              </Col>
              <Col>
                <Route path="/stations/:id" component={RailwaystationDetail} />
              </Col>
            </Row>
          </React.Fragment>
          <Row>
            <Col>
              {api.isLoggedIn() && <Favorites />}
            </Col>
          </Row>
        </React.Fragment>

    }



    console.log("DEBUG RailwaystationsState", this.state)
    return (
      <div className="Railwaystations">
        <Container>
          <SearchBar
            mapState={this.state.showMap}
            handleToUpdate={handleToUpdate.bind(this)}
            onChange={this.handleChange}
            stations={this.state.railwaystations} />
          <Row>
            <Col>
              {display}
            </Col>
            {/* <Col>
              <Route path="/stations/:id" component={RailwaystationDetail} />
            </Col> */}
          </Row>


        </Container>
      </div>
    );
  }
}

export default Railwaystations;
