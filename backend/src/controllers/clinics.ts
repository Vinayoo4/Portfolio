import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Clinic } from '../../../shared/types/index.js';

const dbClinics = getDatabaseAdapter<Clinic>('clinics');

export const getClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await dbClinics.getAll();
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getClinicById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const clinic = await dbClinics.getById(id);
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createClinic = async (req: Request, res: Response) => {
  try {
    const newClinic: Clinic = {
      ...req.body,
      id: crypto.randomUUID(),
    };
    const saved = await dbClinics.insert(newClinic);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateClinic = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await dbClinics.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Clinic not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteClinic = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await dbClinics.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Clinic not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
