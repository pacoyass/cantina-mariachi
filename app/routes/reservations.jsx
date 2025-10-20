import Reservations from "@/pages/reservations/reservations";
import { redirect } from "react-router";

export const meta = () => [
  { title: "Table Reservations - Cantina Mariachi" },
  {
    name: "description",
    content:
      "Reserve your table at Cantina Mariachi. Enjoy authentic Mexican cuisine in our vibrant atmosphere.",
  },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  // Get available time slots
  const today = new Date();
  const availableDates = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    availableDates.push(date.toISOString().split("T")[0]);
  }

  try {
    const lng = request?.language || "en";
    const res = await fetch(
      `${url.origin}/api/cms/reservations?locale=${encodeURIComponent(lng)}`,
      { headers: { cookie } }
    );
    const json = await res.json().catch(() => null);
    return {
      cms: json?.data?.page?.data || {},
      availableDates,
      timeSlots: [
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
      ],
    };
  } catch {
    return {
      cms: {},
      availableDates,
      timeSlots: [
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
      ],
    };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const date = formData.get("date");
  const time = formData.get("time");
  const guests = formData.get("guests");
  const specialRequests = formData.get("specialRequests");

  // Validation
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name is required";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Valid email is required";
  }

  if (!phone || phone.length < 10) {
    errors.phone = "Valid phone number is required";
  }

  if (!date) {
    errors.date = "Date is required";
  }

  if (!time) {
    errors.time = "Time is required";
  }

  if (!guests || guests < 1 || guests > 12) {
    errors.guests = "Number of guests must be between 1 and 12";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      fields: { name, email, phone, date, time, guests, specialRequests },
    };
  }

  try {
    const response = await fetch(
      `${new URL(request.url).origin}/api/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.toLowerCase().trim(),
          customerPhone: phone.trim(),
          date: new Date(date + "T" + time),
          time,
          partySize: parseInt(guests),
          notes: specialRequests?.trim() || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error?.message || "Failed to make reservation",
        fields: { name, email, phone, date, time, guests, specialRequests },
      };
    }

    return redirect(
      `/reservations/confirmation?id=${data.data.reservation.id}`
    );
  } catch (error) {
    return {
      error: "Network error. Please try again.",
      fields: { name, email, phone, date, time, guests, specialRequests },
    };
  }
}

export default function ReservationsPage({ loaderData, actionData }) {
  const { cms, availableDates, timeSlots } = loaderData;

  return (
    <div className="w-full h-svh min-h-max flex justify-center items-center">
      <Reservations
        actionData={actionData}
        cms={cms}
        availableDates={availableDates}
        timeSlots={timeSlots}
      />
    </div>
  );
}
