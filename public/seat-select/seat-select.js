const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const emailInput = document.getElementById("email-input");
const lookFor = document.getElementById("look-for");

let selection = "";

const renderSeats = (flight) => {
  seatsDiv.innerHtml = "";
  document.querySelector(".form-container").style.display = "block";

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
      const seatNum = flight.seatDisplay.find((userItem) => {
        return userItem.id === seatNumber;
      });

      if (seatNum.isAvailable === true) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  fetch(`/flights/${flightNumber}`)
    .then((res) => res.json())
    .then((data) => {
      renderSeats(data);
    });
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
      surName: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      flightNumber: flightInput.value,
      seatNumber: document.getElementsByClassName("selected")[0].innerText,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = `/confirmed?id=${data}`;
    });
};

const setUp = () => {
  fetch("/flights")
    .then((res) => res.json())
    .then((flights) => {
      flights.forEach((num) => {
        let option = document.createElement("option");
        option.innerText = num;
        option.value = num;
        flightInput.appendChild(option);
      });
    });
};
setUp();

const getReservations = (event) => {
  const userEmail = emailInput.value;
  fetch(`/findReservation/${userEmail}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.status === 200) {
        window.location.href = "/confirmed?id=" + data.id;
      } else {
        window.alert("Booking not found ");
      }
    });
};

flightInput.addEventListener("change", toggleFormContent);
lookFor.addEventListener("click", getReservations);
