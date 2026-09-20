import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { DateEntity } from './with-date.entity';
import { WithId } from './with-id.entity';

@Entity('articles')
export class ArticleEntity extends WithId(DateEntity) {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  thumbnail_url: string;

  @Column({ type: 'uuid', nullable: true })
  author_id: string;

  @ManyToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date;
}
