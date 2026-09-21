import { Column, Entity } from 'typeorm';
import { DateEntity } from './with-date.entity';
import { WithId } from './with-id.entity';

@Entity('projects')
export class ProjectEntity extends WithId(DateEntity) {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  thumbnail_url: string;

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date;
}
