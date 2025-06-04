import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class Usuario extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    fecha_nacimiento: Date;

    @Column()
    telefono: string;

    @Column({
        type: "enum",
        enum: ["admin", "user"],
        default: "user"
    })
    role: string;

    @Column({ default: false })
    is_provider: boolean;
 
}
