import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1727284280031 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                { 
                    name: 'userId', 
                    type: 'int', 
                    isPrimary: true, 
                    isGenerated: true, 
                    generationStrategy: 'increment' 
                },
                { 
                    name: 'firstName', 
                    type: 'varchar' 
                },
                { 
                    name: 'lastName', 
                    type: 'varchar' 
                },
                { 
                    name: 'email', 
                    type: 'varchar', 
                    isUnique: true 
                },
                { 
                    name: 'username', 
                    type: 'varchar', 
                    isUnique: true 
                },
                { 
                    name: 'password', 
                    type: 'varchar' 
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
                    onUpdate: 'CURRENT_TIMESTAMP', 
                },
                {
                    name: 'deletedAt',
                    type: 'timestamp',
                    isNullable: true, 
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user', true);
    }
}
