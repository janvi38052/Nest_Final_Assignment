import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBooking1727284280370 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'booking',
            columns: [
                { name: 'bookingId', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'bookingDate', type: 'datetime' },
                { name: 'trainId', type: 'int' },
                { name: 'deletedAt', type: 'timestamp', isNullable: true }, 
                { name: 'createdBy', type: 'int' }, 
                { name: 'updatedBy', type: 'int' },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }, 
            ],
        }), true);

        await queryRunner.createForeignKey('booking', new TableForeignKey({
            columnNames: ['trainId'],
            referencedColumnNames: ['trainId'],
            referencedTableName: 'train',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('booking');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('trainId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('booking', foreignKey);
        }
        await queryRunner.dropTable('booking', true);
    }
}
