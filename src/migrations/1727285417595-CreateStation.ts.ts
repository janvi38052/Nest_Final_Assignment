import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStation1727285417595 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'station',
            columns: [
                { name: 'stationId', type: 'int', isPrimary: true, isGenerated: true },
                { name: 'stationName', type: 'varchar' },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'deletedAt', type: 'timestamp', isNullable: true },
                { name: 'createdBy', type: 'int' },
                { name: 'updatedBy', type: 'int' },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('station', true);
    }
}
