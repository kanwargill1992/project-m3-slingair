"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const {
  reservations,
} = require("../project-m3-slingair/test-data/reservations");
const { v4: uuidv4 } = require("uuid");
const { flights } = require("../project-m3-slingair/test-data/flightSeating");

const q1 = (req, res) => {
  res.status(200).json("ok");
};

const q2 = (req, res) => {
  const flightNumber = req.params.id;
  const seatDisplay = flights[flightNumber];
  res.status(200).json({ seatDisplay });
};

const q3 = (req, res) => {
  res.status(200).json(Object.keys(flights));
};

const q4 = (req, res) => {
  const resWithId = { ...req.body, id: uuidv4() };
  reservations.push(resWithId);
  res.status(200).json(resWithId.id);
};

const q5 = (req, res) => {
  let email = req.params.email;
  let reservation = reservations.find((reservation) => {
    return reservation.email === email;
  });
  if (reservation) {
    res.status(200).json(reservation);
  } else {
    res.status(400).json({ error: "Not Found" });
  }
};

const q6 = (req, res) => {
  let id = req.params.id;
  let reservation = reservations.find((reservation) => {
    return reservation.id === id;
  });

  if (reservation) {
    res.status(200).json(reservation);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
};

const PORT = process.env.PORT || 8000;

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/seat-select", q1)
  .get("/flights/:id", q2)
  .get("/flights", q3)
  .post("/users", q4)
  .get("/findreservation/:email", q5)
  .get("/users/:id", q6)

  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
