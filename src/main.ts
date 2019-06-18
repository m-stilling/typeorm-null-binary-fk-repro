import { createConnection, Connection, getRepository } from "typeorm";
import { ItemEntity } from "./item.entity";
import { CategoryEntity } from "./category.entity";

async function init() {
	const connection = await createConnection({
		type: 'mysql',
		host: 'localhost',
		port: 3306,
		username: 'root',
		password: '',
		database: 'test',
		charset: 'utf8mb4',
		entities: [
			__dirname + '/**/*.entity{.ts,.js}',
		],
		synchronize: true,
		logging: true,
	});

	/**
	 * Repos
	 */
	const categoryRepo = getRepository(CategoryEntity);
	const itemRepo = getRepository(ItemEntity);

	/**
	 * Category A
	 */
	console.log('\n***Saving Category A');
	const categoryA = new CategoryEntity();
	categoryA.uuid = Buffer.alloc(1, 0);
	await categoryRepo.save(categoryA);

	/**
	 * Category B
	 */
	console.log('\n***Saving Category B');
	const categoryB = new CategoryEntity();
	categoryB.uuid = Buffer.alloc(1, 1);
	await categoryRepo.save(categoryB);

	/**
	 * An item
	 */
	console.log('\n***Saving an item');
	const item = new ItemEntity();
	item.uuid = Buffer.alloc(1, 0);
	item.category = categoryA;
	await itemRepo.save(item);

	/**
	 * Update the category of said item
	 */
	console.log('\n***Updating the item (1)');
	item.category = categoryB;
	await itemRepo.save(item); // Category uuid in query parameters is null

	console.log('\n***Updating the item (2)');
	await itemRepo.update({
		uuid: item.uuid,
	}, {
		category: categoryB, // Category uuid in query parameters is null
	});

	console.log('\n***getQueryAndParameters()');
	// Here it's undefined
	console.log('***', itemRepo.createQueryBuilder().update().set({
		category: categoryB,
	}).where({
		uuid: item.uuid,
	}).getQueryAndParameters());

	/**
	 * My temporary workaround
	 */
	console.log('\n***Actually updating the item');
	const query = itemRepo.createQueryBuilder().update().set({
		category: categoryB,
	}).where({
		uuid: item.uuid,
	}).getQuery();

	await itemRepo.query(query, [
		categoryB.uuid,
		item.uuid,
	]);
}

init();