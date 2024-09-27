import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddTrainStationsTable1727294475366 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'train_stations',
            columns: [
                { name: 'trainId', type: 'int' },
                { name: 'stationId', type: 'int' },
            ],
            foreignKeys: [
                new TableForeignKey({
                    columnNames: ['trainId'],
                    referencedColumnNames: ['trainId'],
                    referencedTableName: 'train',
                    onDelete: 'CASCADE',
                }),
                new TableForeignKey({
                    columnNames: ['stationId'],
                    referencedColumnNames: ['stationId'],
                    referencedTableName: 'station',
                    onDelete: 'CASCADE',
                }),
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('train_stations', 'FK_trainId'); 
        await queryRunner.dropForeignKey('train_stations', 'FK_stationId');

        await queryRunner.dropTable('train_stations', true);
    }
}
