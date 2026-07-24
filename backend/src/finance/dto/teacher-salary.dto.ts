import { IsString, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateTeacherSalaryDto {
  @IsUUID()
  teacherId: string;

  @IsUUID()
  studentId: string;

  @IsNumber()
  @Min(0)
  monthlySalary: number;
}

export class UpdateTeacherSalaryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlySalary?: number;
}
