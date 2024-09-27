import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCancellation1727297490995 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cancellation',
                columns: [
                    {
                        name: 'cancellationId',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'cancellationDate',
                        type: 'datetime',
                    },
                    {
                        name: 'reason',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'deletedAt',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'createdBy',
                        type: 'int',
                    },
                    {
                        name: 'updatedBy',
                        type: 'int',
                    },
                    {
                        name: 'ticketId',
                        type: 'int',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'cancellation',
            new TableForeignKey({
                columnNames: ['ticketId'],
                referencedColumnNames: ['ticketId'], 
                referencedTableName: 'ticket',
                onDelete: 'CASCADE', 
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('cancellation');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('ticketId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('cancellation', foreignKey);
        }
        
        await queryRunner.dropTable('cancellation');
    }
}
