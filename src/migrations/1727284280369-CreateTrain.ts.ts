import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTrain1727284280369 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'train',
            columns: [
                { name: 'trainId', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'trainName', type: 'varchar' },
                { name: 'trainNumber', type: 'varchar', isUnique: true },
                { name: 'createdBy', type: 'varchar', isNullable: true },
                { name: 'updatedBy', type: 'varchar', isNullable: true },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                { name: 'deletedAt', type: 'timestamp', isNullable: true },
            ],
        }), true);   
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('train', true);
    }
}
