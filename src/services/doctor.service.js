import Doctor from "../models/doctor.model.js";

export const createDoctor = async (data) => {
    const { name, workingDays, startTime, endTime, slotDuration } = data;

    if (!name || !workingDays || !startTime || !endTime || !slotDuration) {
        throw new Error("All fields are required");
    }

    if (!Array.isArray(workingDays) || workingDays.length === 0) {
        throw new Error("Working days must be a non-empty array");
    }

    if (isNaN(slotDuration) || slotDuration <= 0) {
        throw new Error("Slot duration must be a positive number");
    }

    const doctor = await Doctor.create({
        name,
        workingDays,
        startTime,
        endTime,
        slotDuration,
    });
    return doctor;
}


export const getAllDoctors = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const doctors = await Doctor.find().skip(skip).limit(limit);
  const total = await Doctor.countDocuments();

  return {
    data: doctors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};