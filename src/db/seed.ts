import 'dotenv/config'
import {  ClientTable } from './schemas/client'
import {
  
  PersonalInformationTable
} from './schemas/client/personal-information'
import {
  
  MedicalInformationTable
} from './schemas/client/medical-information'
import {
  BenefitsTable
  
} from './schemas/client/benefits'
import { db } from './index'
import type {ClientRow} from './schemas/client';
import type {InsertPersonalInformationRow} from './schemas/client/personal-information';
import type {InsertMedicalInformationRow} from './schemas/client/medical-information';
import type {InsertBenefitsRow} from './schemas/client/benefits';

type Client = Omit<ClientRow, 'id' | 'createdAt' | 'updatedAt'> & {
  personalInformation: Omit<InsertPersonalInformationRow, 'clientId'>
  medicalInformation?: Omit<InsertMedicalInformationRow, 'clientId'>
  benefits?: Omit<InsertBenefitsRow, 'clientId'>
}

const seedData: Array<Client> = [
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      name: 'Juan Carlos Rodríguez',
      email: 'juan.rodriguez@email.com',
      phone: '+1 (555) 123-4567',
      birthDate: '1985-03-15',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'O+',
      allergies: ['Polen', 'Penicilina'],
      chronicConditions: ['Hipertensión'],
      medications: ['Losartán 50mg', 'Aspirina 100mg'],
      lastCheckup: '2024-01-05',
      emergencyContactName: 'María Rodríguez',
      emergencyContactPhone: '+1 (555) 123-4568',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'Seguros del Norte',
      policyNumber: 'SN-2023-001234',
      coverageType: 'Premium',
      deductible: 500,
      copay: 25,
      annualLimit: 50000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'pending',
    personalInformation: {
      photo: '',
      name: 'María González López',
      email: 'maria.gonzalez@email.com',
      phone: '+1 (555) 234-5678',
      birthDate: '1990-07-22',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'O+',
      allergies: ['Polen', 'Penicilina'],
      chronicConditions: ['Hipertensión'],
      medications: ['Losartán 50mg', 'Aspirina 100mg'],
      lastCheckup: '2024-01-05',
      emergencyContactName: 'María Rodríguez',
      emergencyContactPhone: '+1 (555) 123-4568',
      emergencyContactRelationship: 'Esposa',
    },
  },
  {
    status: 'inactive',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      name: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      phone: '+1 (555) 345-6789',
      birthDate: '1978-11-08',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'B+',
      allergies: ['Látex'],
      chronicConditions: ['Diabetes tipo 2'],
      medications: ['Metformina 500mg', 'Insulina'],
      lastCheckup: '2023-11-20',
      emergencyContactName: 'Elena Silva',
      emergencyContactPhone: '+1 (555) 345-6790',
      emergencyContactRelationship: 'Hija',
    },
    benefits: {
      insuranceProvider: 'HealthGuard',
      policyNumber: 'HG-2023-009012',
      coverageType: 'Basic',
      deductible: 2000,
      copay: 50,
      annualLimit: 15000,
      dentalCoverage: false,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      name: 'Ana Patricia Morales',
      email: 'ana.morales@email.com',
      phone: '+1 (555) 456-7890',
      birthDate: '1992-05-30',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'AB+',
      allergies: ['Nueces'],
      chronicConditions: ['Asma'],
      medications: ['Inhalador Salbutamol'],
      lastCheckup: '2024-01-08',
      emergencyContactName: 'Luis Morales',
      emergencyContactPhone: '+1 (555) 456-7891',
      emergencyContactRelationship: 'Padre',
    },
    benefits: {
      insuranceProvider: 'VitalCare',
      policyNumber: 'VC-2023-003456',
      coverageType: 'Premium',
      deductible: 300,
      copay: 20,
      annualLimit: 75000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      name: 'Carlos Eduardo Vega',
      email: 'carlos.vega@email.com',
      phone: '+1 (555) 567-8901',
      birthDate: '1987-09-12',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'A+',
      allergies: [],
      chronicConditions: [],
      medications: [],
      lastCheckup: '2023-12-10',
      emergencyContactName: 'Patricia Vega',
      emergencyContactPhone: '+1 (555) 567-8902',
      emergencyContactRelationship: 'Madre',
    },
    benefits: {
      insuranceProvider: 'Wellness Plus',
      policyNumber: 'WP-2023-007890',
      coverageType: 'Standard',
      deductible: 800,
      copay: 30,
      annualLimit: 30000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'pending',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      name: 'Sofía Hernández',
      email: 'sofia.hernandez@email.com',
      phone: '+1 (555) 678-9012',
      birthDate: '1995-12-03',
      gender: 'female',
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
      name: 'Lucía Ramírez',
      email: 'lucia.ramirez@email.com',
      phone: '+1 (555) 789-0123',
      birthDate: '1988-04-18',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'B-',
      allergies: ['Lácteos'],
      chronicConditions: ['Artritis'],
      medications: ['Ibuprofeno 400mg'],
      lastCheckup: '2024-01-10',
      emergencyContactName: 'Miguel Ramírez',
      emergencyContactPhone: '+1 (555) 789-0124',
      emergencyContactRelationship: 'Esposo',
    },
    benefits: {
      insuranceProvider: 'HealthMax',
      policyNumber: 'HM-2023-013456',
      coverageType: 'Premium',
      deductible: 400,
      copay: 25,
      annualLimit: 60000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'inactive',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
      name: 'Miguel Ángel Torres',
      email: 'miguel.torres@email.com',
      phone: '+1 (555) 890-1234',
      birthDate: '1982-10-25',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'AB-',
      allergies: ['Polen', 'Ácaros'],
      chronicConditions: ['Hipertensión', 'Colesterol alto'],
      medications: ['Atorvastatina 20mg', 'Enalapril 10mg'],
      lastCheckup: '2023-11-15',
      emergencyContactName: 'Carmen Torres',
      emergencyContactPhone: '+1 (555) 890-1235',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'SecureHealth',
      policyNumber: 'SH-2023-015678',
      coverageType: 'Standard',
      deductible: 1200,
      copay: 35,
      annualLimit: 35000,
      dentalCoverage: true,
      visionCoverage: false,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'pending',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      name: 'Paula Fernández',
      email: 'paula.fernandez@email.com',
      phone: '+1 (555) 901-2345',
      birthDate: '1993-02-11',
      gender: 'female',
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
      name: 'Javier Castillo',
      email: 'javier.castillo@email.com',
      phone: '+1 (555) 012-3456',
      birthDate: '1980-06-09',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'O+',
      allergies: ['Sulfitos'],
      chronicConditions: ['Gastritis'],
      medications: ['Omeprazol 20mg'],
      lastCheckup: '2024-01-12',
      emergencyContactName: 'Isabel Castillo',
      emergencyContactPhone: '+1 (555) 012-3457',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'TotalCare',
      policyNumber: 'TC-2023-019012',
      coverageType: 'Premium',
      deductible: 350,
      copay: 20,
      annualLimit: 80000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
      name: 'Valeria Soto',
      email: 'valeria.soto@email.com',
      phone: '+1 (555) 123-6789',
      birthDate: '1997-08-21',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'B+',
      allergies: [],
      chronicConditions: [],
      medications: [],
      lastCheckup: '2024-01-15',
      emergencyContactName: 'Ricardo Soto',
      emergencyContactPhone: '+1 (555) 123-6790',
      emergencyContactRelationship: 'Padre',
    },
    benefits: {
      insuranceProvider: 'HealthGuard',
      policyNumber: 'HG-2023-020234',
      coverageType: 'Standard',
      deductible: 600,
      copay: 25,
      annualLimit: 40000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'inactive',
    personalInformation: {
      photo: '',
      name: 'Andrés Pérez',
      email: 'andres.perez@email.com',
      phone: '+1 (555) 234-7890',
      birthDate: '1984-01-27',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'A+',
      allergies: ['Polen'],
      chronicConditions: ['Diabetes tipo 1'],
      medications: ['Insulina', 'Metformina 1000mg'],
      lastCheckup: '2023-12-05',
      emergencyContactName: 'Laura Pérez',
      emergencyContactPhone: '+1 (555) 234-7891',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'MediCare Plus',
      policyNumber: 'MP-2023-021456',
      coverageType: 'Basic',
      deductible: 2000,
      copay: 50,
      annualLimit: 12000,
      dentalCoverage: false,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'pending',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop&crop=face',
      name: 'Gabriela Ruiz',
      email: 'gabriela.ruiz@email.com',
      phone: '+1 (555) 345-8901',
      birthDate: '1991-11-14',
      gender: 'female',
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
      name: 'Tomás Herrera',
      email: 'tomas.herrera@email.com',
      phone: '+1 (555) 456-9012',
      birthDate: '1989-05-05',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'AB+',
      allergies: ['Penicilina'],
      chronicConditions: [],
      medications: ['Vitamina B12'],
      lastCheckup: '2024-01-18',
      emergencyContactName: 'Sandra Herrera',
      emergencyContactPhone: '+1 (555) 456-9013',
      emergencyContactRelationship: 'Madre',
    },
    benefits: {
      insuranceProvider: 'Wellness Plus',
      policyNumber: 'WP-2023-023890',
      coverageType: 'Premium',
      deductible: 250,
      copay: 15,
      annualLimit: 90000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      name: 'Diego Mendoza',
      email: 'diego.mendoza@email.com',
      phone: '+1 (555) 567-0123',
      birthDate: '1986-03-18',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'B-',
      allergies: ['Mariscos', 'Polen'],
      chronicConditions: ['Hipertensión'],
      medications: ['Losartán 100mg'],
      lastCheckup: '2024-01-16',
      emergencyContactName: 'Patricia Mendoza',
      emergencyContactPhone: '+1 (555) 567-0124',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'CareFirst',
      policyNumber: 'CF-2023-025012',
      coverageType: 'Standard',
      deductible: 700,
      copay: 30,
      annualLimit: 45000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      name: 'Carmen Jiménez',
      email: 'carmen.jimenez@email.com',
      phone: '+1 (555) 678-1234',
      birthDate: '1994-09-25',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'A-',
      allergies: [],
      chronicConditions: [],
      medications: [],
      lastCheckup: '2024-01-20',
      emergencyContactName: 'Roberto Jiménez',
      emergencyContactPhone: '+1 (555) 678-1235',
      emergencyContactRelationship: 'Padre',
    },
    benefits: {
      insuranceProvider: 'HealthMax',
      policyNumber: 'HM-2023-026134',
      coverageType: 'Premium',
      deductible: 300,
      copay: 20,
      annualLimit: 70000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      name: 'Fernando Castro',
      email: 'fernando.castro@email.com',
      phone: '+1 (555) 789-2345',
      birthDate: '1983-12-07',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'O+',
      allergies: ['Látex'],
      chronicConditions: ['Colesterol alto'],
      medications: ['Atorvastatina 40mg'],
      lastCheckup: '2024-01-19',
      emergencyContactName: 'Elena Castro',
      emergencyContactPhone: '+1 (555) 789-2346',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'SecureHealth',
      policyNumber: 'SH-2023-027256',
      coverageType: 'Standard',
      deductible: 1000,
      copay: 35,
      annualLimit: 40000,
      dentalCoverage: true,
      visionCoverage: false,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=150&h=150&fit=crop&crop=face',
      name: 'Alejandra Vargas',
      email: 'alejandra.vargas@email.com',
      phone: '+1 (555) 890-3456',
      birthDate: '1996-06-14',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'AB-',
      allergies: ['Nueces', 'Polen'],
      chronicConditions: ['Asma'],
      medications: ['Inhalador Budesonida'],
      lastCheckup: '2024-01-22',
      emergencyContactName: 'Carlos Vargas',
      emergencyContactPhone: '+1 (555) 890-3457',
      emergencyContactRelationship: 'Padre',
    },
    benefits: {
      insuranceProvider: 'MediShield',
      policyNumber: 'MS-2023-028378',
      coverageType: 'Basic',
      deductible: 1500,
      copay: 40,
      annualLimit: 25000,
      dentalCoverage: false,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      name: 'Ricardo Delgado',
      email: 'ricardo.delgado@email.com',
      phone: '+1 (555) 901-4567',
      birthDate: '1990-01-29',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'A+',
      allergies: [],
      chronicConditions: [],
      medications: ['Multivitamínico'],
      lastCheckup: '2024-01-21',
      emergencyContactName: 'María Delgado',
      emergencyContactPhone: '+1 (555) 901-4568',
      emergencyContactRelationship: 'Madre',
    },
    benefits: {
      insuranceProvider: 'TotalCare',
      policyNumber: 'TC-2023-029490',
      coverageType: 'Premium',
      deductible: 400,
      copay: 25,
      annualLimit: 65000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      name: 'Isabella Romero',
      email: 'isabella.romero@email.com',
      phone: '+1 (555) 012-5678',
      birthDate: '1992-08-11',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'B+',
      allergies: ['Frutas cítricas'],
      chronicConditions: ['Migrañas'],
      medications: ['Rizatriptán'],
      lastCheckup: '2024-01-23',
      emergencyContactName: 'Antonio Romero',
      emergencyContactPhone: '+1 (555) 012-5679',
      emergencyContactRelationship: 'Esposo',
    },
    benefits: {
      insuranceProvider: 'HealthGuard',
      policyNumber: 'HG-2023-030512',
      coverageType: 'Standard',
      deductible: 800,
      copay: 30,
      annualLimit: 50000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
      name: 'Sebastián Ortega',
      email: 'sebastian.ortega@email.com',
      phone: '+1 (555) 123-6789',
      birthDate: '1988-11-03',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'O-',
      allergies: ['Penicilina'],
      chronicConditions: ['Hipertensión'],
      medications: ['Amlodipino 5mg'],
      lastCheckup: '2024-01-24',
      emergencyContactName: 'Lucía Ortega',
      emergencyContactPhone: '+1 (555) 123-6790',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'VitalCare',
      policyNumber: 'VC-2023-031634',
      coverageType: 'Premium',
      deductible: 350,
      copay: 20,
      annualLimit: 75000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      name: 'Natalia Espinoza',
      email: 'natalia.espinoza@email.com',
      phone: '+1 (555) 234-7890',
      birthDate: '1995-04-16',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'A+',
      allergies: ['Lácteos'],
      chronicConditions: [],
      medications: [],
      lastCheckup: '2024-01-25',
      emergencyContactName: 'Roberto Espinoza',
      emergencyContactPhone: '+1 (555) 234-7891',
      emergencyContactRelationship: 'Padre',
    },
    benefits: {
      insuranceProvider: 'Wellness Plus',
      policyNumber: 'WP-2023-032756',
      coverageType: 'Standard',
      deductible: 600,
      copay: 25,
      annualLimit: 40000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: false,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop&crop=face',
      name: 'Emilio Navarro',
      email: 'emilio.navarro@email.com',
      phone: '+1 (555) 345-8901',
      birthDate: '1981-07-28',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'AB+',
      allergies: ['Polen', 'Ácaros'],
      chronicConditions: ['Diabetes tipo 2'],
      medications: ['Metformina 850mg', 'Insulina'],
      lastCheckup: '2024-01-26',
      emergencyContactName: 'Carmen Navarro',
      emergencyContactPhone: '+1 (555) 345-8902',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'HealthMax',
      policyNumber: 'HM-2023-033878',
      coverageType: 'Premium',
      deductible: 300,
      copay: 20,
      annualLimit: 80000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
      name: 'Camila Restrepo',
      email: 'camila.restrepo@email.com',
      phone: '+1 (555) 456-9012',
      birthDate: '1993-10-12',
      gender: 'female',
    },
    medicalInformation: {
      bloodType: 'B-',
      allergies: ['Mariscos'],
      chronicConditions: ['Hipotiroidismo'],
      medications: ['Levotiroxina 75mcg'],
      lastCheckup: '2024-01-27',
      emergencyContactName: 'Diego Restrepo',
      emergencyContactPhone: '+1 (555) 456-9013',
      emergencyContactRelationship: 'Hermano',
    },
    benefits: {
      insuranceProvider: 'CareFirst',
      policyNumber: 'CF-2023-034990',
      coverageType: 'Standard',
      deductible: 700,
      copay: 30,
      annualLimit: 45000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
  {
    status: 'active',
    personalInformation: {
      photo:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
      name: 'Óscar Gutiérrez',
      email: 'oscar.gutierrez@email.com',
      phone: '+1 (555) 567-0123',
      birthDate: '1987-02-22',
      gender: 'male',
    },
    medicalInformation: {
      bloodType: 'O+',
      allergies: [],
      chronicConditions: ['Colesterol alto'],
      medications: ['Simvastatina 20mg'],
      lastCheckup: '2024-01-29',
      emergencyContactName: 'Patricia Gutiérrez',
      emergencyContactPhone: '+1 (555) 567-0124',
      emergencyContactRelationship: 'Esposa',
    },
    benefits: {
      insuranceProvider: 'SecureHealth',
      policyNumber: 'SH-2023-036112',
      coverageType: 'Premium',
      deductible: 400,
      copay: 25,
      annualLimit: 70000,
      dentalCoverage: true,
      visionCoverage: true,
      mentalHealthCoverage: true,
    },
  },
]

async function insertClient(client: Client) {
  const { status, personalInformation, medicalInformation, benefits } = client
  const [createdClient] = await db
    .insert(ClientTable)
    .values({
      status,
    })
    .returning({ id: ClientTable.id })

  const clientId = createdClient.id

  await db
    .insert(PersonalInformationTable)
    .values({ ...personalInformation, clientId })

  if (medicalInformation) {
    await db
      .insert(MedicalInformationTable)
      .values({ ...medicalInformation, clientId })
  }

  if (benefits) {
    await db.insert(BenefitsTable).values({ ...benefits, clientId })
  }
}

async function seed() {
  for (const newClient of seedData) {
    await insertClient(newClient)
  }
}

seed()
  .then(() => {
     
    console.log('Database seeded successfully')
    process.exit(0)
  })
  .catch((error) => {
     
    console.error('Error seeding database', error)
    process.exit(1)
  })
