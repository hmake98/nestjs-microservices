import { EntityRepository, Repository } from 'typeorm';
import { Posts } from '../entities/post.entity';

@EntityRepository(Posts)
export class PostRepository extends Repository<Posts> {
  public async getPosts(
    skip: number,
    limit: number,
    term: string,
  ): Promise<Posts[]> {
    const query = this.createQueryBuilder('posts')
      .select()
      .take(limit)
      .skip(skip);
    if (term) {
      query.where('content ILIKE :term', { term });
    }
    return query.getMany();
  }
}
