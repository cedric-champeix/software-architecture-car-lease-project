import { PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ContractStatus } from 'src/domain/entities/contract.entity';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;
}
