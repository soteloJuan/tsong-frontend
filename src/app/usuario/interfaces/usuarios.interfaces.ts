export interface UsuarioInterface{

    id: string,
    apellidos: string,
    bloqueado: boolean,
    confirmarCorreo: boolean,
    email: string,
    google: boolean
    imagenID: string,
    imagenURL: string,
    nombre: string,
    password: string,
    role: "USER"
}
