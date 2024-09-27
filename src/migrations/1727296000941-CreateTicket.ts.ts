import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTicket1727296000941 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'ticket',
                columns: [
                    {
                        name: 'ticketId',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'startTime',
                        type: 'datetime',
                    },
                    {
                        name: 'source',
                        type: 'varchar',
                    },
                    {
                        name: 'destination',
                        type: 'varchar',
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'noOfSeats',
                        type: 'int',
                    },
                    {
                        name: 'dateTime',
                        type: 'datetime',
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
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ticket');
    }
}
