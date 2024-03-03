import { ArgumentMetadata, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { QueryTypedto, FormatedQueryType , PaginationQueryType, PrismaSearchQueryType} from 'src/user/dto/query-validation.dto'

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(queries: QueryTypedto, metadata: ArgumentMetadata) : FormatedQueryType {
    let paginationQueries: PaginationQueryType = {};
    let prismaSearchQueries :PrismaSearchQueryType = {};

    const take = parseInt(queries.take, 10);
    const skip = parseInt(queries.skip, 10);
    prismaSearchQueries.search = queries?.search;
    prismaSearchQueries.sort = queries?.sort;
    prismaSearchQueries.field = queries?.field;

    if (!isNaN(take) && take >= 0)
      paginationQueries.take = take;
    if (!isNaN(skip) && take >= 0)
      paginationQueries.skip= skip;
      
    return {
      paginationQueries: paginationQueries,
      searchQueries: prismaSearchQueries,
    };
  };
}
