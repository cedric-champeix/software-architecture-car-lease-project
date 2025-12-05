import { QueueNames } from '@lib/out-messages/enum/queue-names';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Queue, QueueEvents } from 'bullmq';

import { TestAppModule } from '../../test-app.module';

interface VehicleMaintenanceJobData {
  vehicleId: string;
}

describe('VehicleMaintenanceConsumer (Queue Integration)', () => {
  let app: INestApplication;
  let vehicleQueue: Queue;
  let queueEvents: QueueEvents;

  beforeAll(async () => {
    process.env.MONGO_URI = 'mongodb://localhost/car-lease-test-queue';
    process.env.DISABLE_CONSUMERS = 'true';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    vehicleQueue = new Queue(QueueNames.VehicleMaintenance, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

    queueEvents = new QueueEvents(QueueNames.VehicleMaintenance, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  });

  afterEach(async () => {
    await vehicleQueue.drain();
    await vehicleQueue.clean(0, 1000, 'completed');
    await vehicleQueue.clean(0, 1000, 'failed');
  });

  afterAll(async () => {
    await queueEvents.close();
    await vehicleQueue.close();
    await app.close();
  });

  describe('Queue Connectivity', () => {
    it('should successfully add a job to the queue', async () => {
      const vehicleId = '507f1f77bcf86cd799439011';

      const job = await vehicleQueue.add('process-maintenance', {
        vehicleId,
      });

      const jobData = job.data as VehicleMaintenanceJobData;

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(jobData.vehicleId).toBe(vehicleId);
    });

    it('should add multiple jobs to the queue', async () => {
      const vehicleIds = [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013',
      ];

      const jobs = await Promise.all(
        vehicleIds.map((vehicleId) =>
          vehicleQueue.add('process-maintenance', { vehicleId }),
        ),
      );

      expect(jobs).toHaveLength(3);
      jobs.forEach((job, index) => {
        const jobData = job.data as VehicleMaintenanceJobData;
        expect(job.id).toBeDefined();
        expect(jobData.vehicleId).toBe(vehicleIds[index]);
      });
    });

    it('should retrieve job by id', async () => {
      const vehicleId = '507f1f77bcf86cd799439014';

      const job = await vehicleQueue.add('process-maintenance', {
        vehicleId,
      });

      const retrievedJob = await vehicleQueue.getJob(job.id!);

      const retrievedJobData = retrievedJob?.data as
        | VehicleMaintenanceJobData
        | undefined;

      expect(retrievedJob).toBeDefined();
      expect(retrievedJob?.id).toBe(job.id);
      expect(retrievedJobData?.vehicleId).toBe(vehicleId);
    });
  });

  describe('Job Data Validation', () => {
    it('should accept valid vehicle ID', async () => {
      const validId = '507f1f77bcf86cd799439017';

      const job = await vehicleQueue.add('process-maintenance', {
        vehicleId: validId,
      });

      const jobData = job.data as VehicleMaintenanceJobData;

      expect(jobData.vehicleId).toBe(validId);
    });

    it('should store job with correct queue name', async () => {
      const job = await vehicleQueue.add('process-maintenance', {
        vehicleId: '507f1f77bcf86cd799439018',
      });

      expect(job.queueName).toBe(QueueNames.VehicleMaintenance);
    });
  });
});
