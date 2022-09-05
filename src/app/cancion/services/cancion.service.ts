
import {Injectable} from '@angular/core';


// Enviroment
import {environment} from '../../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// interfaces
import {CancionInterface} from '../interfaces/cancion.interface';

// rxjs
import { map, catchError, tap, mergeMap } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})




export class CancionService{

    private baseUrl: string = environment.base_url;

    constructor(private http: HttpClient){
    }

    get token(): string{
        return localStorage.getItem('token') || '';
    }

    get headers(){
        return {
            headers: {
                'token': this.token
            }
        };
    }

    crearCancion(data: any){
        return this.http.post(`${this.baseUrl}api/cancion/create`, data, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    guardarImagenCancion(imagen: File, idCancion:string){

        const formData = new FormData;
        formData.append('imagen', imagen);

        return this.http.put(`${this.baseUrl}api/cancion/updateImagen/${idCancion}`, formData, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    actualizarDatosBasicosCancion(idCancion: string, data: any){
        
        return this.http.put(`${this.baseUrl}api/cancion/update/${idCancion}`, data, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    actualizarArchivoDeMusica(cancion: File, idCancion: string){

        const formData = new FormData;
        formData.append('cancion', cancion);

        return this.http.put(`${this.baseUrl}api/cancion/updateCancion/${idCancion}`, formData, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarCancionPorId(idCancion: string){
        return this.http.get(`${this.baseUrl}api/cancion/get/${idCancion}`, this.headers).pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarCancionAleatorio(){
        return this.http.get(`${this.baseUrl}api/cancion/getRandom`, this.headers).pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarCancionPorIdMergeMap(arrayIdsCanciones: string[]){
        return from(arrayIdsCanciones).pipe(
            mergeMap((id) => <Observable<any>> this.http.get(`${this.baseUrl}api/cancion/get/${id}`, this.headers) ),
            map( (res: any) => res.data)
        );
    }

    consultarTodasCanciones(numeroPagina: number){
        return this.http.get(`${this.baseUrl}api/cancion/gets/${numeroPagina}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarCancionesPorTermino(termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/cancion/search/${termino}/${pagina}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    return res.data;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarCancionesPorAlbum(idAlbum: string){
        return this.http.get(`${this.baseUrl}api/cancion/gets/porAlbum/${idAlbum}`, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarCancionesPorAlbumPaginado(idAlbum: string, pagina: number){ 
        return this.http.get(`${this.baseUrl}api/cancion/gets/porAlbumPaginado/${idAlbum}/${pagina}`, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    eliminarImagenCancion(idCancion: string){

        return this.http.delete(`${this.baseUrl}api/cancion/deleteImagen/${idCancion}`, this.headers)
        .pipe( 
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    eliminarCancion(idCancion: string){

        return this.http.delete(`${this.baseUrl}api/cancion/delete/${idCancion}`, this.headers)
        .pipe( 
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    convertirACancionInterface(data: any): CancionInterface{
        const cancion: CancionInterface = {
            id: data._id,
            bloqueado: data.bloqueado,
            fechaLanzamiento: data.fechaLanzamiento,
            imagenID: data.imagenID,
            imagenURL: data.imagenURL,
            nombre: data.nombre,
            numero: data.numero,
            duracion: data.duracion,
            cancionID: data.cancionID,
            cancionURL: data.cancionURL,
            genero: data.genero,
            artista: data.artista,
            album: data.album,
        };
        return cancion;

    }



    get generosMusical() {
        return [
            "AFRO",
            "AGOGO",
            "AIRES ESPAÑOLES",
            "ALBORADA",
            "ALEGRO VIVACE",
            "ANATEADA",
            "ANDANTE",
            "ARIA",
            "AUQUI AUQUI",
            "BAGUALA",
            "BAILECITO",
            "BAILE",
            "BAILES",
            "BAION",
            "BALADA",
            "BALLET",
            "BAMBUCO",
            "BARCAROLA",
            "BATUCADA",
            "BEAT",
            "BEGUINE",
            "BERCEUSE",
            "BLUES",
            "BOCETO",
            "BOGALOO",
            "BOLERO",
            "BOMBA",
            "BOOGIE BOOGIE",
            "BOSSA NOVA",
            "BOTECITO",
            "BULERIAS",
            "CACHACA",
            "CACHARPAYA",
            "CAJITA DE MUSICA",
            "CALIPSO",
            "CAMPERA",
            "CAN CAN",
            "CANCION",
            "CANCION DE CUNA",
            "CANCION FOLKLORICA",
            "CANCION INDIA",
            "CANCION INFANTIL",
            "CANCION MAPUCHE",
            "CANDOMBE",
            "CANON",
            "CANTATA",
            "CANTE JONDO",
            "CANZONETTA",
            "CAPRICCIO",
            "CARAMBA",
            "CARNAVAL",
            "CARNAVALITO",
            "CASASCHOKT",
            "CATERETE",
            "CATUMBE",
            "CHA CHA CHA",
            "CHACARERA",
            "CHACARERA DEL MONTE",
            "CHAMAME",
            "CHAMARRITA",
            "CHARANGA",
            "CHARLESTON",
            "CHAYA",
            "CHORO",
            "CHUNTUNQUI",
            "CHUTUNSKY",
            "CIELITO",
            "CIFRA",
            "CONCIERTO",
            "CONGA",
            "CONTRAPUNTO",
            "COPLAS",
            "COPLERA",
            "CORAL",
            "CORRALERA",
            "CORRIDO",
            "COSTERA",
            "COUNTRY",
            "COUPLE",
            "CUANDO",
            "CUARTETO",
            "CUECA",
            "CUMBIA",
            "CZARDAS",
            "DABKE",
            "DANZA",
            "DANZA INDIGENA",
            "DECIMAS",
            "DELIRIO",
            "DENGUE",
            "DISCO",
            "DIXELAND",
            "ELEGIA",
            "ERKENCHADA",
            "ESCONDIDO",
            "ESTILO",
            "ESTUDIO",
            "FADO",
            "FANDANGO",
            "FANDANGUILLO",
            "FANTASIA",
            "FARRUCA",
            "FLAMENCO",
            "FOLK",
            "FOX TROT",
            "FUGA",
            "FUNKY",
            "FUSION",
            "GAITA",
            "GALOPA",
            "GALOPE INDIANO",
            "GARROTIN",
            "GATO",
            "GAVOTA",
            "GRANADINA",
            "GUAJIRA",
            "GUALAMBAO",
            "GUARACHA",
            "GUARANIA",
            "GUARASON",
            "HABANERA",
            "HIMNO",
            "HIP HOP",
            "HUASTECA",
            "HUAYNO",
            "HUAYNO SIKURI",
            "HUELLA",
            "HUPANGO",
            "IMPRONTU",
            "INTERMEDIO",
            "JALAITO",
            "JARABE",
            "JAVA",
            "JAZZ",
            "JINGLE",
            "JOROPO",
            "JOTA",
            "JUGUETE MUSICAL",
            "KAANI",
            "KALUYO",
            "KANTU",
            "KASHUA",
            "KIRGI",
            "LAGARTERANAS",
            "LAMBADA",
            "LAMENTO",
            "LANCEROS",
            "LARGO",
            "LETANIAS",
            "LIMBO",
            "LITORALEÑA",
            "LONCO MEO",
            "MACUMBA",
            "MADRIGAL",
            "MALAGUEÑAS",
            "MALAMBO",
            "MALON",
            "MAMBO",
            "MANAKE",
            "MARACATO",
            "MARCHA",
            "MARCHA DISCO",
            "MARCHINHA",
            "MAREA",
            "MAXIXA",
            "MAZURCA",
            "MEGAMBO",
            "MELODIA",
            "MERECUMBE",
            "MERENGUE",
            "MEREQUETENGUE",
            "MILONGA",
            "MILONGON",
            "MINUE",
            "MORUNO",
            "MOSAICO ESPAÑOL",
            "MUÑEIRA",
            "MUSICA DE CAMARA",
            "MUSICA SACRA",
            "MUSICA SINFONICA",
            "NEW AGE",
            "NOCTURNO",
            "NORTEÑA",
            "OBERTURA",
            "OPERA",
            "OPERETA",
            "ORACION",
            "ORATORIO",
            "PACHANGA",
            "PALA PALA",
            "PARRANDA",
            "PASACALLE",
            "PASEAITO",
            "PASEO",
            "PASILLO",
            "PASO DOBLE",
            "PASTORAL",
            "PATA PATA",
            "PAVANA",
            "PERICON",
            "PETENERA",
            "PIM PIM",
            "PLAYERA",
            "PLEGARIA",
            "POEMA FOLKLORICO",
            "POEMA SINFONICO",
            "POLCA / POLKA",
            "POLCA CORRENTINA",
            "POLONESA",
            "POP",
            "PORRO",
            "POTPOURRI",
            "PREGON",
            "PRELUDIO",
            "PUNK",
            "PURAJEHI",
            "QUENA QUENA",
            "QUINTETO",
            "RAG TIME",
            "RANCHEIRA",
            "RANCHERA",
            "RAP",
            "RAPSODIA",
            "RASGUIDO DOBLE",
            "RASPA",
            "REGGAE",
            "REGGAETON",
            "REMEDIO",
            "RETUMBO",
            "REVERIE",
            "RHYTHM AND BLUES",
            "RITMO ALEGRE",
            "RITMO LATINO",
            "RITMO TAHITIANO",
            "ROCK",
            "ROGATIVA",
            "ROMANZA",
            "RONDA",
            "RONDO",
            "RUMBA",
            "SALSA",
            "SAMBA",
            "SAYA",
            "SCHERZZO",
            "SCHOTTIS",
            "SEGUIDILLAS",
            "SERENATA",
            "SERRANA",
            "SEVILLANAS",
            "SEXTETO",
            "SHAKE",
            "SHERIKO",
            "SHIMMY",
            "SHOTIS MISIONERO",
            "SIKURIADA",
            "SINFONIA",
            "SINFONICO Y CAMARA",
            "SKA",
            "SLOP",
            "SLOW",
            "SOLEARES",
            "SON",
            "SONATA",
            "SONATINA",
            "SOUFLE",
            "SOUL",
            "SOW",
            "STORNELLO",
            "SUITE",
            "SUREÑA",
            "SURF",
            "SWING",
            "TAIELL /  TAIL",
            "TAMBORITO",
            "TANGO",
            "TANGUILLO",
            "TAQUIRARI / TAKIRARI",
            "TARANTELLA",
            "TARKEADA",
            "TECNO",
            "TELECOTECO",
            "TERMINO",
            "TIJERA",
            "TIJUANA",
            "TINKU",
            "TOBA",
            "TONADA",
            "TRIO",
            "TRISTE",
            "TRIUNFO",
            "TROPICAL",
            "TWIST",
            "VALLENATO",
            "VALS",
            "VALSEADO",
            "VIDALA",
            "VIDALA COMPARSERA",
            "VIDALITA",
            "VILLANCICO",
            "YARAVI",
            "YENKA",
            "ZAMBA",
            "ZAMBRA",
            "ZARZUELA",
            "ZORTZICO"
        ];
    }

}
