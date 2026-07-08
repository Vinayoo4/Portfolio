import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Patient } from '../../../shared/types/index.js';

const dbPatients = getDatabaseAdapter<Patient>('patients');

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await dbPatients.getAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const patient = await dbPatients.getById(id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const newPatient: Patient = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    const saved = await dbPatients.insert(newPatient);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await dbPatients.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await dbPatients.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Patient not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
