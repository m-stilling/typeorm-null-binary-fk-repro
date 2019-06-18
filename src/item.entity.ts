import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Index, OneToOne, Column } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('items')
export class ItemEntity {
	@PrimaryColumn({
		type: 'binary',
		length: 1,
	})
	public uuid: Buffer;

	@OneToOne(() => CategoryEntity, category => category.uuid, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		nullable: false,
	})
	@JoinColumn()
	public category: CategoryEntity;
}
