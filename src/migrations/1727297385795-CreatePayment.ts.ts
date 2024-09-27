import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePayment1727297385795 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'payment',
                columns: [
                    {
                        name: 'paymentId',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'paymentMethod',
                        type: 'varchar',
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamp',
                        isNullable: true,
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
            'payment',
            new TableForeignKey({
                columnNames: ['ticketId'],
                referencedColumnNames: ['ticketId'],
                referencedTableName: 'ticket',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('payment');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('ticketId') !== -1);
        await queryRunner.dropForeignKey('payment', foreignKey);

        await queryRunner.dropTable('payment');
    }
}
