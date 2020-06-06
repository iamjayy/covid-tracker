import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Columns from "react-columns";
import Form from "react-bootstrap/Form";

function App() {
  const [latest, setLatest] = useState([]);
  const [results, setResults] = useState([]);
  const [searchCountries, setSearchCountries] = useState("");

  useEffect(() => {
    axios
      .all([
        axios.get("https://disease.sh/v2/all"),
        axios.get("https://disease.sh/v2/countries")
      ])
      .then(responseArr => {
        setLatest(responseArr[0].data);
        setResults(responseArr[1].data);
      })
      .catch(err => {
        console.log(err);
      });
  });

  const date = new Date(parseInt(latest.updated));
  const lastUpdated = date.toString();

  const filterCountries = results.filter(item => {
    return searchCountries !== ""
      ? item.country.includes(searchCountries)
      : item;
  });

  //create a function to loop through the cards instead of hard coding 100+ cards
  const countries = filterCountries.map((data, i) => {
    return (
      <Card
        key={i}
        bg="light"
        text={"dark"}
        className="text-center"
        style={{ margin: "10px" }}
      >
        <Card.Img variant="top" src={data.countryInfo.flag} />
        <Card.Body>
          <Card.Title>{data.country}</Card.Title>
          <Card.Text>Cases: {latest.cases}</Card.Text>
          <Card.Text>Deaths: {latest.deaths}</Card.Text>
          <Card.Text>Recovered: {latest.recovered}</Card.Text>
          <Card.Text>Today's Cases: {latest.todayCases}</Card.Text>
          <Card.Text>Today's Death: {latest.todayDeaths}</Card.Text>
          <Card.Text>Active: {latest.active}</Card.Text>
          <Card.Text>Critical: {latest.critical}</Card.Text>
        </Card.Body>
      </Card>
    );
  });

  var queries = [
    {
      columns: 2,
      query: "min-width: 500px"
    },
    {
      columns: 3,
      query: "min-width: 1000px"
    }
  ];

  return (
    <div>
      <br />
      <h2 style={{ textAlign: "center" }}>Covid-19 Stats</h2>
      <h6 style={{ textAlign: "center" }}>Updated every 10 mins</h6>
      <br />

      <CardDeck>
        <Card bg="secondary" text="white" style={{ margin: "10px" }}>
          <Card.Body>
            <Card.Title>Cases</Card.Title>
            <Card.Text>{latest.cases}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small>Last updated {lastUpdated}</small>
          </Card.Footer>
        </Card>
        <Card
          bg="danger"
          text={"white"}
          className="text-center"
          style={{ margin: "10px" }}
        >
          <Card.Body>
            <Card.Title>Deaths</Card.Title>
            <Card.Text>{latest.deaths}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small>Last updated {lastUpdated}</small>
          </Card.Footer>
        </Card>
        <Card
          bg="success"
          text={"white"}
          className="text-center"
          style={{ margin: "10px" }}
        >
          <Card.Body>
            <Card.Title>Recovered</Card.Title>
            <Card.Text>{latest.recovered}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small>Last updated {lastUpdated}</small>
          </Card.Footer>
        </Card>
      </CardDeck>
      <br />

      <Form>
        <Form.Group controlId="formGroupSearch">
          <Form.Control
            type="text"
            placeholder="Search For A Country"
            onChange={e => setSearchCountries(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Columns queries={queries}>{countries}</Columns>
    </div>
  );
}

export default App;
