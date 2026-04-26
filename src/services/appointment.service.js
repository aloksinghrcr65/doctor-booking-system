import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";
import { generateSlots } from "../utils/slotGenerator.js";

export const getAvailableSlots = async (doctorId, date) => {
  if (!doctorId || !date) {
    throw new Error("doctorId and date are required");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const day = new Date(date).toLocaleString("en-US", {
    weekday: "long",
  });

  if (!doctor.workingDays.includes(day)) {
    return []; // doctor not available that day
  }

  const allSlots = generateSlots(
    doctor.startTime,
    doctor.endTime,
    doctor.slotDuration,
  );

  const bookedAppointments = await Appointment.find({
    doctorId,
    date,
  });

  const bookedSlots = bookedAppointments.map((a) => a.time);

  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

  return availableSlots;
};

export const bookingAppointment = async (data) => {
  const { doctorId, date, time, userName } = data;

  if (!doctorId || !date || !time || !userName) {
    throw new Error("All fields are required");
  }

  // Prevent past booking
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    throw new Error("Cannot book past dates");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const day = new Date(date).toLocaleString("en-US", {
    weekday: "long",
  });

  if (!doctor.workingDays.includes(day)) {
    throw new Error("Doctor not available on this day");
  }

  const validSlots = generateSlots(
    doctor.startTime,
    doctor.endTime,
    doctor.slotDuration,
  );

  if (!validSlots.includes(time)) {
    throw new Error("Invalid time slot");
  }

  try {
    const appointment = await Appointment.create({
      doctorId,
      date,
      time,
      userName,
    });

    return appointment;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Slot already booked");
    }
    throw error;
  }
};
