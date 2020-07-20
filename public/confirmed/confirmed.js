const name = document.getElementById("name");
const email = document.getElementById("email");
const seat = document.getElementById("seat");
const flight = document.getElementById("flight");

const url = new URL(location.href);
const flightId = url.searchParams.get("id");
console.log(flightId);
fetch("/users/" + flightId)
  .then((res) => {
    return res.json();
  })
  .then((reservation) => {
    name.innerText = reservation.givenName + " " + reservation.surName;
    email.innerText = reservation.email;
    seat.innerText = reservation.seatNumber;
    flight.innerText = reservation.flightNumber;
  });
