import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Service } from '../../../shared/types/index.js';

const dbServices = getDatabaseAdapter<Service>('services');

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await dbServices.getAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const service = await dbServices.getById(id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const newService: Service = {
      ...req.body,
      id: crypto.randomUUID(),
    };
    const saved = await dbServices.insert(newService);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await dbServices.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await dbServices.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
