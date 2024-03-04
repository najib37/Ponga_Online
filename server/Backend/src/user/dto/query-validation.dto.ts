
import {
  IsOptional,
  IsNumberString,
  ValidateNested,
  IsString,
  IsArray,
  IsDefined,
  Validate,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator'

@ValidatorConstraint()
class Requires implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {

    const result = validationArguments.constraints.every(constraint => {
      return validationArguments.object[constraint] !== undefined;
    });
    return result;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} Requires ${args.constraints.toString().replace(',', ', ')}`;
  }
}

export type  PaginationQueryType = {
  take?: number,
  skip?: number,
}
export type  PrismaSearchQueryType = {
  field?: string,
  search?: string,
  sort?: string,
}

export class QueryTypedto {

  @IsOptional()
  @IsString()
  @Validate(Requires, ['search', 'sort'])
  field: string// ['title'],

  @IsOptional()
  @IsString()
  @Validate(Requires, ['field', 'sort'])
  search: string //'database',

  @IsOptional()
  @IsString()
  username: string //'database',

  @IsOptional()
  @IsString()
  @Validate(Requires, ['search', 'field'])
  sort: string // asc

  @IsOptional()
  @IsNumberString()
  skip: string;

  @IsOptional()
  @IsNumberString()
  take: string;
}

export type FormatedQueryType = {
  // [Property in keyof Partial<Omit<QueryTypedto, 'field' | 'sort' | 'search'>>]: number;
  paginationQueries: PaginationQueryType,
  searchQueries: PrismaSearchQueryType,
};

