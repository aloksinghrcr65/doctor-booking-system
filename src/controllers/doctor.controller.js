import * as DoctorService from "../services/doctor.service.js";

export const createDoctor = async (req, res, next) => {
    try {
        const doctor = await DoctorService.createDoctor(req.body);

        return res.status(201).json({
            success: true,
            data: doctor,
        });
    } catch (error) {  
        next(error);   
    }
}


export const getDoctors = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const result = await DoctorService.getAllDoctors(page, limit);

    res.status(200).json({
      success: true,
      message: `Retrieved ${result.data.length} doctors from page ${page}`,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};