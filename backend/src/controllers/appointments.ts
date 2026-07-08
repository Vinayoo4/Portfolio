import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Appointment } from '../../../shared/types/index.js';

const dbAppointments = getDatabaseAdapter<Appointment>('appointments');

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { date, dentistId } = req.query;

    const query: Partial<Appointment> = {};
    if (date) query.date = date as string;
    if (dentistId) query.dentistId = dentistId as string;

    let appointments = dbAppointments.findMany
      ? await dbAppointments.findMany(query)
      : await dbAppointments.getAll();

    if (!dbAppointments.findMany) {
      if (date) {
        appointments = appointments.filter(a => a.date === date);
      }
      if (dentistId) {
        appointments = appointments.filter(a => a.dentistId === dentistId);
      }
    }

    // Sort by start time
    appointments.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const newAppt: Appointment = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    const saved = await dbAppointments.insert(newAppt);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await dbAppointments.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await dbAppointments.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
