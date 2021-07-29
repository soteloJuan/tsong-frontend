export interface AdministradorInterface{

    id: string,
    apellidos: string,
    bloqueado: boolean,
    confirmarCorreo: boolean,
    email: string,
    imagenID: string,
    imagenURL: string,
    nombre: string,
    password: string,
    role: "ADMIN_PRO" | "ADMIN"
}