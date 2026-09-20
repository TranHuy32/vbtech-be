import { Column, Entity } from 'typeorm';
import { DateEntity } from './with-date.entity';
import { WithId } from './with-id.entity';

@Entity('inquiries')
export class InquiryEntity extends WithId(DateEntity) {
  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  company: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 20, default: 'new' })
  status: string;
}
