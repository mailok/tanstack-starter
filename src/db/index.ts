import fs from 'fs/promises';
import path from 'path';

// Type definitions
export type ClientStatus = 'active' | 'pending' | 'inactive';


export type PersonalInformation = {
	photo: string;
	name: string;
	email: string;
	phone: string;
	birthDate: string;
	age: number;
	gender: 'male' | 'female';
};

export type EmergencyContact = {
	name: string;
	phone: string;
	relationship: string;
};

export type MedicalInformation = {
	bloodType?: string;
	allergies?: string[];
	chronicConditions?: string[];
	medications?: string[];
	lastCheckup?: string;
	emergencyContact?: EmergencyContact;
};

export type Benefits = {
	insuranceProvider?: string;
	policyNumber?: string;
	coverageType?: 'Basic' | 'Standard' | 'Premium';
	deductible?: number;
	copay?: number;
	annualLimit?: number;
	dentalCoverage?: boolean;
	visionCoverage?: boolean;
	mentalHealthCoverage?: boolean;
};

export type Client = {
	id: string;
	status: ClientStatus;
	createdAt: string;
	updatedAt: string;
	personalInformation: PersonalInformation;
	medicalInformation: MedicalInformation;
	benefits: Benefits;
};

export type DatabaseData = {
	clients: Client[];
};

const DB_PATH = path.join(process.cwd(), 'public', 'data.json')

// Helper functions
const readDatabase = async (): Promise<DatabaseData> => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error(`Failed to read database: ${error}`)
  }
}

const writeDatabase = async (data: DatabaseData): Promise<void> => {
	try {
		await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
	} catch (error) {
		throw new Error(`Failed to write database: ${error}`);
	}
};

// Client API
const clients = {
	findBy: async (criteria: Partial<Client>): Promise<Client[]> => {
		const db = await readDatabase();
		return db.clients.filter((client) => {
			return Object.entries(criteria).every(([key, value]) => {
				const clientValue = client[key as keyof Client];
				if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					// Handle nested object matching
					return Object.entries(value).every(([nestedKey, nestedValue]) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const nestedClientValue = (clientValue as any)?.[nestedKey];
						return nestedClientValue === nestedValue;
					});
				}
				return clientValue === value;
			});
		});
	},

	deleteBy: async (criteria: Partial<Client>): Promise<number> => {
		const db = await readDatabase();
		const initialLength = db.clients.length;

		db.clients = db.clients.filter((client) => {
			return !Object.entries(criteria).every(([key, value]) => {
				const clientValue = client[key as keyof Client];
				if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					// Handle nested object matching
					return Object.entries(value).every(([nestedKey, nestedValue]) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const nestedClientValue = (clientValue as any)?.[nestedKey];
						return nestedClientValue === nestedValue;
					});
				}
				return clientValue === value;
			});
		});

		const deletedCount = initialLength - db.clients.length;
		if (deletedCount > 0) {
			await writeDatabase(db);
		}

		return deletedCount;
	},

	filterBy: async (predicate: (client: Client) => boolean): Promise<Client[]> => {
		const db = await readDatabase();
		return db.clients.filter(predicate);
	},

	insert: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
		const db = await readDatabase();

		// Generate new ID
		const maxId = Math.max(...db.clients.map((c) => parseInt(c.id)), 0);
		const newId = (maxId + 1).toString();

		// Create new client with timestamps
		const now = new Date().toISOString();
		const newClient: Client = {
			...client,
			id: newId,
			createdAt: now,
			updatedAt: now
		};

		db.clients.push(newClient);
		await writeDatabase(db);

		return newClient;
	},

	update: async (
		id: string,
		updates: Partial<Omit<Client, 'id' | 'createdAt'>>
	): Promise<Client | null> => {
		const db = await readDatabase();
		const clientIndex = db.clients.findIndex((client) => client.id === id);

		if (clientIndex === -1) {
			return null;
		}

		// Update client with new timestamp
		const updatedClient: Client = {
			...db.clients[clientIndex],
			...updates,
			updatedAt: new Date().toISOString()
		};

		db.clients[clientIndex] = updatedClient;
		await writeDatabase(db);

		return updatedClient;
	},

	// Additional utility methods
	getAll: async (): Promise<Client[]> => {
		const db = await readDatabase();
		return db.clients;
	},

	getById: async (id: string): Promise<Client | null> => {
		const db = await readDatabase();
		return db.clients.find((client) => client.id === id) || null;
	},

	count: async (): Promise<number> => {
		const db = await readDatabase();
		return db.clients.length;
	},

	countByStatus: async (status: ClientStatus): Promise<number> => {
		const db = await readDatabase();
		return db.clients.filter((client) => client.status === status).length;
	}
};

// Main database export
const db = {
	clients
};

export default db;
