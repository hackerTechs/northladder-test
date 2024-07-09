import express from "express";
import { response, trimBody } from "./utils/helpers";
import { IEvent, IFilterData } from "./utils/types";
import bodyParser from "body-parser";

const PORT = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/*+json" }));
const jsonParser = bodyParser.json();

let DATA: Array<IEvent> = [];

// ADD EVENT
app.post("/events", jsonParser, (req, res) => {
  const { eventName, eventDate } = req.body;
  if (!eventName.trim()) {
    return response.error(res, {
      message: "Event name is required",
      status: 400,
    });
  }

  if (!eventDate.trim()) {
    return response.error(res, {
      message: "Event date is required",
      status: 400,
    });
  }

  const data = {
    ...(trimBody(req.body) as IEvent),
    id: Math.round(Math.random() * 100000000),
  };
  DATA.push(data);

  return response.success(res, {
    message: "Event added successfully",
    status: 201,
  });
});

// GET EVENTS
app.get("/events", (req, res) => {
  let data = [...DATA];
  if (Object.keys(req.query).length) {
    const {
      eventName,
      organizer,
      email,
      phone,
      eventDate,
      street,
      city,
      state,
      zip,
    } = trimBody(req.query) as unknown as IFilterData;

    data = data.filter(
      (ev) =>
        (eventName
          ? ev.eventName.toLowerCase().includes(eventName.toLowerCase())
          : true) &&
        (organizer
          ? ev.organizer.toLowerCase().includes(organizer.toLowerCase())
          : true) &&
        (email ? ev.email.toLowerCase().includes(email.toLowerCase()) : true) &&
        (phone ? ev.phone.toLowerCase().includes(phone.toLowerCase()) : true) &&
        (eventDate ? ev.eventDate === eventDate : true) &&
        (street
          ? ev.location.street.toLowerCase().includes(street.toLowerCase())
          : true) &&
        (city
          ? ev.location.city.toLowerCase().includes(city.toLowerCase())
          : true) &&
        (state
          ? ev.location.state.toLowerCase().includes(state.toLowerCase())
          : true) &&
        (zip ? ev.location.zip.toLowerCase().includes(zip.toLowerCase()) : true)
    );
  }

  return response.success(res, {
    message: "Get events successfully",
    data,
  });
});

// GET EVENT
app.get("/events/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return response.error(res, {
      message: "No event found",
      status: 404,
    });
  }

  const event = DATA.find((ev) => ev.id === +id);
  if (!event) {
    return response.error(res, {
      message: "No event found",
      status: 404,
    });
  }

  return response.success(res, {
    message: "Get events successfully",
    data: event,
  });
});

// UPDATE EVENT
app.put("/events/:id", jsonParser, (req, res) => {
  const { id } = req.params;

  if (!id) {
    return response.error(res, {
      message: "No event found",
      status: 404,
    });
  }

  const { eventName, eventDate } = req.body;
  if (eventName?.trim() === "") {
    return response.error(res, {
      message: "Event name is required",
      status: 400,
    });
  }

  if (eventDate?.trim() === "") {
    return response.error(res, {
      message: "Event date is required",
      status: 400,
    });
  }

  const eventIndex = DATA.findIndex((ev) => ev.id === +id);
  if (eventIndex !== -1) {
    const temp: IEvent = {
      ...DATA[eventIndex],
      ...trimBody(req.body),
      id: +id,
      updatedAt: new Date().toDateString(),
    };
    DATA.splice(eventIndex, 1, temp);
    return response.success(res, {
      message: "Event updated successfully",
    });
  } else {
    return response.error(res, {
      message: "No event found",
      status: 404,
    });
  }
});

// DELETE EVENT
app.delete("/events/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return response.error(res, {
      message: "No event found",
      status: 404,
    });
  }

  const eventIndex = DATA.findIndex((ev) => ev.id === +id);
  if (eventIndex !== -1) {
    const temp = { ...DATA[eventIndex], ...req.body, id };
    DATA.splice(eventIndex, 1);
    return response.success(res, {
      message: "Event deleted successfully",
    });
  } else {
    return response.error(res, {
      message: "No event found",
      status: 404,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
