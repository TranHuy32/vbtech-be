import { Column, Entity } from 'typeorm';
import { WithId } from './with-id.entity';
import { DateEntity } from './with-date.entity';
import { Role } from '../constants';

@Entity('users')
export class UserEntity extends WithId(DateEntity) {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: false, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 20, default: 'admin' })
  role: Role;
}
