# Batch Processing and Event-Driven Architecture

## Table of Contents
- [Overview](#overview)
- [Batch Processing with Cron](#batch-processing-with-cron)
- [Event-Driven Architecture with Redis](#event-driven-architecture-with-redis)
- [Comparison: Batch vs Events](#comparison-batch-vs-events)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)

---

## Overview

Our Car Lease Management System uses two complementary approaches for handling asynchronous operations:

1. **Batch Processing (Cron)**: For scheduled, periodic tasks
2. **Event-Driven (Redis/RabbitMQ)**: For real-time, event-based reactions

Each approach is chosen based on the specific requirements of the business scenario.

---

## Batch Processing with Cron

### Use Case: Handle Overdue Contracts

#### Business Requirement

> **Scenario**: If a client does not return the vehicle on time, the contract becomes *late*. If a late return prevents a subsequent rental, the next contract must be automatically *cancelled*.

#### Why Batch Processing?

We chose a **cron-based batch approach** for handling overdue contracts for several key reasons:

##### 1. **Time-Based Nature**

Contracts become overdue based on the passage of time, not on specific events:
- A contract with `endDate = 2024-12-05` becomes overdue at midnight on 2024-12-06
- This is a **temporal condition**, not triggered by user action
- Perfect fit for scheduled, periodic checks

##### 2. **Non-Critical Timing**

Overdue detection doesn't need to be real-time:
- Checking once per day at midnight is sufficient
- No business requirement for immediate detection
- Acceptable delay: up to 24 hours
- **Batch processing is more efficient** than continuous polling

##### 3. **Bulk Operations**

The task processes multiple contracts in a single run:
- Scan all active contracts
- Identify overdue ones
- Update their status
- Find and cancel affected contracts
- **Batch processing is more efficient** for bulk operations

##### 4. **Resource Efficiency**

Running once per day is more efficient than:
- Continuous event listeners
- Real-time polling
- Database triggers
- **Lower resource consumption** and **simpler infrastructure**

##### 5. **Predictable Load**

Scheduled execution provides:
- Predictable system load
- Easy to monitor and debug
- Can run during off-peak hours
- **Better resource planning**

#### Implementation

##### Cron Service

```typescript
// libs/in-cron/src/tasks.service.ts
import { HandleOverdueContractsUseCase } from '@lib/domain/use-cases/contract/handle-overdue-contracts';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private readonly handleOverdueContractsUseCase: HandleOverdueContractsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.handleOverdueContractsUseCase.execute();
  }
}
```

**Key Points**:
- Runs **every day at midnight** (00:00)
- Uses NestJS `@Cron` decorator
- Delegates to domain use case
- Infrastructure concern (scheduling) separated from business logic

##### Use Case Logic

```typescript
// libs/domain/src/use-cases/contract/handle-overdue-contracts/handle-overdue-contracts.use-case.ts
const AFFECTED_CONTRACTS_DATE_RANGE = ONE_DAY_IN_MS * 3;

export class HandleOverdueContractsUseCase extends UseCase<void, void> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(): Promise<void> {
    // 1. Fetch all contracts
    const contracts = await this.contractRepository.findAll({});

    // 2. Filter overdue contracts
    const overdueContracts = contracts.filter(
      (contract) =>
        contract.status === ContractStatus.ACTIVE &&
        contract.endDate < new Date(),
    );

    // 3. Process each overdue contract
    for (const { id, startDate, endDate, vehicleId } of overdueContracts) {
      // 3a. Mark contract as overdue
      const updateContract = new UpdateContract({
        status: ContractStatus.OVERDUE,
      });
      await this.contractRepository.update({ contract: updateContract, id });

      // 3b. Find affected contracts (within 3-day window)
      const affectedContracts =
        await this.contractRepository.findByVehicleIdAndDateRange({
          endDate: new Date(endDate.getTime() + AFFECTED_CONTRACTS_DATE_RANGE),
          startDate,
          vehicleId,
        });

      // 3c. Cancel affected contracts
      for (const affectedContract of affectedContracts) {
        if (affectedContract.id !== id) {
          const updateContract = new UpdateContract({
            status: ContractStatus.CANCELLED,
          });

          await this.contractRepository.update({
            contract: updateContract,
            id: affectedContract.id,
          });
        }
      }
    }
  }
}
```

**Business Logic**:
1. **Identify overdue contracts**: `endDate < now` and `status = ACTIVE`
2. **Update status**: Mark as `OVERDUE`
3. **Find affected contracts**: Contracts for the same vehicle within 3 days
4. **Cancel affected contracts**: Prevent conflicts

##### Module Configuration

```typescript
// libs/in-cron/src/in-cron.module.ts
import { DomainModule } from '@lib/domain';
import { OutMongooseModule } from '@lib/out-mongoose';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron scheduling
    DomainModule,             // Import domain use cases
    OutMongooseModule,        // Import repositories
  ],
  providers: [TasksService],
})
export class InCronModule {}
```

#### Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Every Day at 00:00                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   TasksService                              │
│  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          HandleOverdueContractsUseCase                      │
│                                                             │
│  1. Fetch all contracts                                    │
│  2. Filter overdue (endDate < now)                         │
│  3. For each overdue contract:                             │
│     a. Update status to OVERDUE                            │
│     b. Find affected contracts (same vehicle, date range)  │
│     c. Cancel affected contracts                           │
└─────────────────────────────────────────────────────────────┘
```

#### Benefits of Batch Approach

✅ **Simple**: Single scheduled task, easy to understand  
✅ **Efficient**: Runs once per day, minimal resource usage  
✅ **Reliable**: Predictable execution time  
✅ **Maintainable**: Easy to monitor and debug  
✅ **Scalable**: Can process thousands of contracts in one run  
✅ **Cost-Effective**: No need for real-time infrastructure  

#### Monitoring and Observability

```typescript
// Enhanced version with logging
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async handleCron() {
  const startTime = Date.now();
  this.logger.log('Starting overdue contracts batch job');

  try {
    await this.handleOverdueContractsUseCase.execute();
    
    const duration = Date.now() - startTime;
    this.logger.log(`Completed overdue contracts batch job in ${duration}ms`);
  } catch (error) {
    this.logger.error('Failed to process overdue contracts', error);
    // Could send alert to monitoring system
  }
}
```

---

## Event-Driven Architecture with Redis

### Use Case: Cancel Contracts for Vehicles in Maintenance

#### Business Requirement

> **Scenario**: If a vehicle becomes broken (enters maintenance), all pending contracts related to it must be automatically cancelled.

#### Why Event-Driven?

We chose an **event-driven approach** with Redis/RabbitMQ for vehicle maintenance for several key reasons:

##### 1. **Event-Triggered**

Vehicle maintenance is triggered by a specific action:
- Admin marks vehicle as "MAINTENANCE"
- This is a **discrete event**, not a time-based condition
- Perfect fit for event-driven architecture

##### 2. **Immediate Response Required**

Business requires immediate action:
- When vehicle enters maintenance, contracts must be cancelled **immediately**
- Cannot wait for next batch job (could be up to 24 hours)
- **Real-time processing is essential**

##### 3. **Decoupling**

Event-driven architecture decouples components:
- Vehicle update service doesn't need to know about contracts
- Contract cancellation is handled by a separate consumer
- **Loose coupling** enables independent evolution

##### 4. **Scalability**

Message queues provide scalability:
- Can add multiple consumers to handle load
- Automatic retry on failure
- **Horizontal scaling** capability

##### 5. **Asynchronous Processing**

Non-blocking operation:
- Vehicle update returns immediately
- Contract cancellation happens asynchronously
- **Better user experience** (no waiting)

#### Implementation

##### Message Producer (Output Adapter)

```typescript
// libs/out-messages/src/vehicle/vehicle-maintenance.producer.ts
import { JobNames } from '@lib/out-messages/enum/job-names';
import { QueueNames } from '@lib/out-messages/enum/queue-names';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

@Injectable()
export class VehicleMaintenanceProducer {
  constructor(
    @InjectQueue(QueueNames.VehicleMaintenance) private queue: Queue
  ) {}

  async sendVehicleMaintenanceEvent(vehicleId: string): Promise<void> {
    await this.queue.add(JobNames.VehicleMaintenance, { vehicleId });
  }
}
```

**Key Points**:
- Publishes event to `VehicleMaintenance` queue
- Payload: `{ vehicleId: string }`
- Non-blocking: returns immediately

##### Message Consumer (Input Adapter)

```typescript
// libs/in-messages/src/vehicle/vehicle-maintenance.consumer.ts
import { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import { QueueNames } from '@lib/out-messages/enum/queue-names';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface VehicleMaintenanceJobData {
  vehicleId: string;
}

@Processor(QueueNames.VehicleMaintenance)
export class VehicleMaintenanceConsumer extends WorkerHost {
  constructor(
    private readonly cancelContractsForVehicleInMaintenanceUseCase: 
      CancelContractsForVehicleInMaintenanceUseCase,
  ) {
    super();
  }

  async process(
    job: Job<VehicleMaintenanceJobData, any, string>,
  ): Promise<any> {
    const { vehicleId } = job.data;

    await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicleId);

    return;
  }
}
```

**Key Points**:
- Listens to `VehicleMaintenance` queue
- Extracts `vehicleId` from job data
- Delegates to domain use case

##### Use Case Logic

```typescript
// libs/domain/src/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance/cancel-contracts-for-vehicle-in-maintenance.use-case.ts
export class CancelContractsForVehicleInMaintenanceUseCase extends UseCase<
  string,
  void
> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(vehicleId: string): Promise<void> {
    // Find all pending contracts for this vehicle
    const contracts = await this.contractRepository.findAll({});
    
    const pendingContracts = contracts.filter(
      (contract) =>
        contract.vehicleId === vehicleId &&
        contract.status === ContractStatus.PENDING,
    );

    // Cancel each pending contract
    for (const contract of pendingContracts) {
      const updateContract = new UpdateContract({
        status: ContractStatus.CANCELLED,
      });

      await this.contractRepository.update({
        contract: updateContract,
        id: contract.id,
      });
    }
  }
}
```

**Business Logic**:
1. **Find pending contracts**: For the specific vehicle
2. **Cancel each contract**: Update status to `CANCELLED`

##### Integration in Update Vehicle Use Case

```typescript
// libs/domain/src/use-cases/vehicle/update-vehicle/update-vehicle.use-case.ts
export class UpdateVehicleUseCase extends UseCase<
  UpdateVehicleUseCaseInput,
  Vehicle
> {
  constructor(
    protected readonly repository: VehicleRepository,
    private readonly vehicleMaintenanceProducer: VehicleMaintenanceProducer,
  ) {
    super();
  }

  async execute({
    id,
    status,
    ...updateData
  }: UpdateVehicleUseCaseInput): Promise<Vehicle> {
    const vehicle = new UpdateVehicle(updateData);

    if (status) {
      vehicle.status = status;
    }

    const updatedVehicle = await this.repository.update({
      id,
      vehicleData: vehicle,
    });

    // If vehicle enters maintenance, publish event
    if (status === VehicleStatus.MAINTENANCE) {
      await this.vehicleMaintenanceProducer.sendVehicleMaintenanceEvent(id);
    }

    return updatedVehicle!;
  }
}
```

**Key Points**:
- After updating vehicle status
- If status is `MAINTENANCE`, publish event
- Event triggers asynchronous contract cancellation

#### Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Admin Updates Vehicle Status                   │
│              PUT /vehicles/:id                              │
│              { status: "MAINTENANCE" }                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              VehicleController                              │
│  Calls UpdateVehicleUseCase                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           UpdateVehicleUseCase                              │
│  1. Update vehicle in database                             │
│  2. If status = MAINTENANCE:                               │
│     → Publish event to queue                               │
│  3. Return updated vehicle                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        VehicleMaintenanceProducer                           │
│  Publishes { vehicleId } to VehicleMaintenance queue       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Redis/RabbitMQ Queue                           │
│  Stores message until consumer is ready                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        VehicleMaintenanceConsumer                           │
│  Listens to VehicleMaintenance queue                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  CancelContractsForVehicleInMaintenanceUseCase             │
│  1. Find all pending contracts for vehicle                 │
│  2. Cancel each contract                                   │
└─────────────────────────────────────────────────────────────┘
```

#### Benefits of Event-Driven Approach

✅ **Real-Time**: Immediate response to vehicle maintenance  
✅ **Decoupled**: Vehicle and contract services are independent  
✅ **Scalable**: Can add multiple consumers  
✅ **Resilient**: Automatic retry on failure  
✅ **Asynchronous**: Non-blocking operation  
✅ **Auditable**: Message queue provides event log  

#### Queue Configuration

```typescript
// Queue names enum
export enum QueueNames {
  VehicleMaintenance = 'vehicle-maintenance',
}

// Job names enum
export enum JobNames {
  VehicleMaintenance = 'vehicle-maintenance-job',
}
```

#### Error Handling and Retry

```typescript
// Enhanced consumer with error handling
@Processor(QueueNames.VehicleMaintenance, {
  attempts: 3,              // Retry up to 3 times
  backoff: {
    type: 'exponential',    // Exponential backoff
    delay: 1000,            // Start with 1 second
  },
})
export class VehicleMaintenanceConsumer extends WorkerHost {
  async process(job: Job<VehicleMaintenanceJobData>): Promise<any> {
    try {
      const { vehicleId } = job.data;
      await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicleId);
      
      this.logger.log(`Successfully cancelled contracts for vehicle ${vehicleId}`);
    } catch (error) {
      this.logger.error(`Failed to cancel contracts for vehicle ${job.data.vehicleId}`, error);
      throw error; // Will trigger retry
    }
  }
}
```

---

## Comparison: Batch vs Events

### Decision Matrix

| Criterion | Batch (Cron) | Events (Redis) |
|-----------|--------------|----------------|
| **Trigger** | Time-based | Action-based |
| **Timing** | Scheduled (periodic) | Immediate |
| **Latency** | Minutes to hours | Milliseconds |
| **Resource Usage** | Low (runs once/day) | Higher (always listening) |
| **Complexity** | Simple | Moderate |
| **Scalability** | Vertical | Horizontal |
| **Use Case** | Overdue contracts | Vehicle maintenance |

### When to Use Batch Processing

✅ **Time-based conditions** (e.g., daily reports, cleanup tasks)  
✅ **Non-urgent operations** (acceptable delay)  
✅ **Bulk processing** (many items at once)  
✅ **Predictable load** (known execution time)  
✅ **Resource efficiency** (run during off-peak hours)  

**Examples**:
- Daily overdue contract detection
- Monthly billing
- Nightly database backups
- Weekly report generation

### When to Use Event-Driven

✅ **Action-triggered** (user action, system event)  
✅ **Immediate response required** (real-time)  
✅ **Decoupling needed** (independent services)  
✅ **Scalability required** (variable load)  
✅ **Asynchronous processing** (non-blocking)  

**Examples**:
- Vehicle enters maintenance → cancel contracts
- Order placed → send confirmation email
- Payment received → activate subscription
- File uploaded → process and notify

---

## Implementation Details

### Technology Stack

#### Batch Processing
- **Framework**: NestJS `@nestjs/schedule`
- **Scheduler**: Node.js `cron` (via `node-cron`)
- **Execution**: In-process (same application)

#### Event-Driven
- **Message Broker**: Redis (via BullMQ)
- **Alternative**: RabbitMQ (can be swapped)
- **Queue Library**: `@nestjs/bullmq`
- **Execution**: Separate workers (can be scaled)

### Infrastructure Requirements

#### Batch Processing
```yaml
# Minimal infrastructure
services:
  app:
    image: car-leasing-app
    environment:
      - ENABLE_CRON=true
```

#### Event-Driven
```yaml
# Requires message broker
services:
  app:
    image: car-leasing-app
    depends_on:
      - redis
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Testing Strategies

#### Testing Batch Jobs

```typescript
describe('HandleOverdueContractsUseCase', () => {
  it('should mark contracts as overdue', async () => {
    // Arrange
    const mockContracts = [
      { id: '1', status: 'ACTIVE', endDate: new Date('2024-01-01') },
    ];
    mockRepository.findAll.mockResolvedValue(mockContracts);

    // Act
    await useCase.execute();

    // Assert
    expect(mockRepository.update).toHaveBeenCalledWith({
      id: '1',
      contract: expect.objectContaining({ status: 'OVERDUE' }),
    });
  });
});
```

#### Testing Event Consumers

```typescript
describe('VehicleMaintenanceConsumer', () => {
  it('should cancel contracts when vehicle enters maintenance', async () => {
    // Arrange
    const job = { data: { vehicleId: 'vehicle-123' } } as Job;

    // Act
    await consumer.process(job);

    // Assert
    expect(cancelContractsUseCase.execute).toHaveBeenCalledWith('vehicle-123');
  });
});
```

---

## Best Practices

### Batch Processing Best Practices

1. **Idempotency**: Ensure jobs can be run multiple times safely
2. **Logging**: Log start, end, and errors
3. **Monitoring**: Track execution time and success rate
4. **Error Handling**: Graceful failure, don't crash the app
5. **Resource Limits**: Batch size limits to avoid memory issues
6. **Timing**: Run during off-peak hours when possible

### Event-Driven Best Practices

1. **Idempotency**: Handle duplicate messages gracefully
2. **Retry Logic**: Implement exponential backoff
3. **Dead Letter Queue**: Handle permanently failed messages
4. **Message Versioning**: Support schema evolution
5. **Monitoring**: Track queue depth and processing time
6. **Timeout**: Set reasonable job timeouts

### Common Pitfalls to Avoid

❌ **Using events for time-based tasks** (use cron instead)  
❌ **Using batch for urgent operations** (use events instead)  
❌ **No error handling** (always handle failures)  
❌ **No monitoring** (can't debug what you can't see)  
❌ **Tight coupling** (keep domain logic separate)  

---

## Conclusion

Our Car Lease Management System demonstrates the effective use of both batch processing and event-driven architecture:

### Batch Processing (Cron)
- **Use Case**: Handle overdue contracts
- **Why**: Time-based, non-urgent, bulk operation
- **Benefit**: Simple, efficient, predictable

### Event-Driven (Redis)
- **Use Case**: Cancel contracts for vehicles in maintenance
- **Why**: Action-triggered, immediate, decoupled
- **Benefit**: Real-time, scalable, resilient

By choosing the right approach for each scenario, we achieve:
- ✅ Optimal resource utilization
- ✅ Appropriate response times
- ✅ Maintainable architecture
- ✅ Scalable system

The key is understanding the **nature of the requirement** and selecting the **appropriate architectural pattern** to solve it.

---

## Further Reading

- [NestJS Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Event-Driven Architecture Patterns](https://martinfowler.com/articles/201701-event-driven.html)
- [Batch Processing Best Practices](https://aws.amazon.com/batch/getting-started/)
