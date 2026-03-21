import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserRole } from '../../users/entities/user.entity';
import { DoctorEntity } from '../../doctors/entities/doctor.entity';
import { AvailabilityEntity } from '../../doctors/entities/availability.entity';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { MedicalRecordEntity } from '../../medical-records/entities/medical-record.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hospital_booking',
  entities: [
    UserEntity,
    DoctorEntity,
    AvailabilityEntity,
    AppointmentEntity,
    MedicalRecordEntity,
  ],
  synchronize: true,
});

async function seed() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected. Seeding data...');

  const userRepo = dataSource.getRepository(UserEntity);
  const doctorRepo = dataSource.getRepository(DoctorEntity);
  const availabilityRepo = dataSource.getRepository(AvailabilityEntity);

  // Check if admin already exists
  const existingAdmin = await userRepo.findOne({
    where: { email: 'admin@hospital.com' },
  });

  if (existingAdmin) {
    console.log('Seed data already exists. Skipping...');
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);
  const doctorPassword = await bcrypt.hash('doctor123', 12);

  // Create admin user
  const admin = userRepo.create({
    email: 'admin@hospital.com',
    password: hashedPassword,
    firstName: 'System',
    lastName: 'Admin',
    phone: '+1000000000',
    role: UserRole.ADMIN,
    isActive: true,
  });
  await userRepo.save(admin);
  console.log('Admin user created: admin@hospital.com / admin123');

  // Create doctor users
  const doctorUsers = [
    {
      email: 'dr.smith@hospital.com',
      password: doctorPassword,
      firstName: 'James',
      lastName: 'Smith',
      phone: '+1111111111',
      role: UserRole.DOCTOR,
      city: 'New York',
      country: 'US',
      isActive: true,
    },
    {
      email: 'dr.johnson@hospital.com',
      password: doctorPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1222222222',
      role: UserRole.DOCTOR,
      city: 'Los Angeles',
      country: 'US',
      isActive: true,
    },
    {
      email: 'dr.williams@hospital.com',
      password: doctorPassword,
      firstName: 'Michael',
      lastName: 'Williams',
      phone: '+1333333333',
      role: UserRole.DOCTOR,
      city: 'New York',
      country: 'US',
      isActive: true,
    },
  ];

  const savedDoctorUsers: UserEntity[] = [];
  for (const du of doctorUsers) {
    const user = userRepo.create(du);
    savedDoctorUsers.push(await userRepo.save(user));
  }

  // Create doctor profiles
  const doctorProfiles = [
    {
      userId: savedDoctorUsers[0].id,
      specialization: 'Cardiology',
      licenseNumber: 'LIC-CARD-001',
      bio: 'Board-certified cardiologist with over 15 years of experience in treating heart conditions. Specializes in interventional cardiology and preventive cardiac care.',
      averageRating: 4.8,
      totalReviews: 124,
      appointmentDurationMinutes: 30,
      consultationFee: 200,
      clinicName: 'Heart Care Center',
      clinicAddress: '123 Medical Ave, New York, NY 10001',
      isAvailable: true,
    },
    {
      userId: savedDoctorUsers[1].id,
      specialization: 'Dermatology',
      licenseNumber: 'LIC-DERM-002',
      bio: 'Fellowship-trained dermatologist specializing in clinical and cosmetic dermatology. Expert in skin cancer screening, acne treatment, and anti-aging procedures.',
      averageRating: 4.6,
      totalReviews: 89,
      appointmentDurationMinutes: 20,
      consultationFee: 150,
      clinicName: 'Skin Health Clinic',
      clinicAddress: '456 Wellness Blvd, Los Angeles, CA 90001',
      isAvailable: true,
    },
    {
      userId: savedDoctorUsers[2].id,
      specialization: 'Orthopedics',
      licenseNumber: 'LIC-ORTH-003',
      bio: 'Orthopedic surgeon with expertise in sports medicine and joint replacement. Treated professional athletes and specializes in minimally invasive surgical techniques.',
      averageRating: 4.9,
      totalReviews: 156,
      appointmentDurationMinutes: 30,
      consultationFee: 250,
      clinicName: 'Joint & Bone Specialists',
      clinicAddress: '789 Health St, New York, NY 10002',
      isAvailable: true,
    },
  ];

  const savedDoctors: DoctorEntity[] = [];
  for (const dp of doctorProfiles) {
    const doctor = doctorRepo.create(dp);
    savedDoctors.push(await doctorRepo.save(doctor));
  }

  // Create availabilities for each doctor (Mon-Fri, 9AM-5PM)
  for (const doctor of savedDoctors) {
    const availabilities: Partial<AvailabilityEntity>[] = [];

    for (let day = 0; day <= 4; day++) {
      availabilities.push({
        doctorId: doctor.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '12:00',
        isActive: true,
      });
      availabilities.push({
        doctorId: doctor.id,
        dayOfWeek: day,
        startTime: '13:00',
        endTime: '17:00',
        isActive: true,
      });
    }

    for (const avail of availabilities) {
      const entity = availabilityRepo.create(avail);
      await availabilityRepo.save(entity);
    }
  }

  // Create a sample patient
  const patientPassword = await bcrypt.hash('patient123', 12);
  const patient = userRepo.create({
    email: 'patient@example.com',
    password: patientPassword,
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+1444444444',
    role: UserRole.PATIENT,
    city: 'New York',
    country: 'US',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    isActive: true,
  });
  await userRepo.save(patient);
  console.log('Patient user created: patient@example.com / patient123');

  console.log('Seed completed successfully!');
  console.log(`Created: 1 admin, 3 doctors, 1 patient`);
  console.log('Doctor logins (all use password: doctor123):');
  for (const du of doctorUsers) {
    console.log(`  - ${du.email}`);
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
