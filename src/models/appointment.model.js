import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    time: {
      type: String, // "HH:mm"
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent double booking
appointmentSchema.index(
  { doctorId: 1, date: 1, time: 1 },
  { unique: true }
);

export default mongoose.model("Appointment", appointmentSchema);