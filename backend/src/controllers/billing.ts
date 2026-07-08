import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Appointment, Service } from '../../../shared/types/index.js';

const dbAppointments = getDatabaseAdapter<Appointment>('appointments');
const dbServices = getDatabaseAdapter<Service>('services');

export const getRevenueOverview = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    let appointments;
    if (dbAppointments.findMany) {
      appointments = await dbAppointments.findMany({ status: 'COMPLETED' as any });
    } else {
      appointments = await dbAppointments.getAll();
      appointments = appointments.filter(a => a.status === 'COMPLETED');
    }

    const services = await dbServices.getAll();
    const servicePriceMap = new Map(services.map(s => [s.id, s.price]));

    let totalRevenue = 0;
    let completedCount = 0;

    appointments.forEach(appt => {
      if (appt.date >= (startDate as string) && appt.date <= (endDate as string)) {
        completedCount++;
        if (appt.services && appt.services.length > 0) {
          appt.services.forEach(serviceId => {
            totalRevenue += servicePriceMap.get(serviceId) || 0;
          });
        } else {
          totalRevenue += 150;
        }
      }
    });

    res.json({
      startDate,
      endDate,
      totalRevenue,
      appointmentsCompleted: completedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
