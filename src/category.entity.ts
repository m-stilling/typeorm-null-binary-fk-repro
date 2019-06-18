import { Entity, PrimaryColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
	@PrimaryColumn({
		type: 'binary',
		length: 1,
	})
	public uuid: Buffer;
}
