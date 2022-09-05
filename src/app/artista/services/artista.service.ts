import {Injectable} from '@angular/core';

// Enviroment
import {environment} from '../../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// interfaces
import { ArtistaInterface } from '../interfaces/artista.interface';

// rxjs
import { map, catchError, tap, mergeMap  } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ArtistaService{

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

    guardarImagenArtista(imagen: File, idArtista:string){

        const formData = new FormData;
        formData.append('imagen', imagen);

        return this.http.put(`${this.baseUrl}api/artista/updateImagen/${idArtista}`, formData, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    crearArtista(data: any){
        return this.http.post(`${this.baseUrl}api/artista/create`, data, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarArtistasPorId(idArtista: string){        
        return this.http.get(`${this.baseUrl}api/artista/get/${idArtista}`, this.headers).pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarArtistaPorIdMergeMap(arrayIdsArtistas: string[]){
        return from(arrayIdsArtistas).pipe(
            mergeMap((id) => <Observable<any>> this.http.get(`${this.baseUrl}api/artista/get/${id}`, this.headers) ),
            map( (res: any) => res.data)
        );
    }

    consultarTodosArtistas(numeroPagina: number){        
        return this.http.get(`${this.baseUrl}api/artista/gets/${numeroPagina}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarArtistasPorTermino(termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/artista/search/${termino}/${pagina}`, this.headers)
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

    consultarTodosArtistasSinFiltro(){
        return this.http.get(`${this.baseUrl}api/artista/gets/noPaginado`, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    actualizarDatosBasicosArtista(idArtista: string, data: any){
        
        return this.http.put(`${this.baseUrl}api/artista/update/${idArtista}`, data, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    eliminarImagenArtista(idArtista: string){

        return this.http.delete(`${this.baseUrl}api/artista/deleteImagen/${idArtista}`, this.headers)
        .pipe( 
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    
    eliminarArtista(idArtista: string){
        return this.http.delete(`${this.baseUrl}api/artista/delete/${idArtista}`, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    convertirAArtistaInterface(data: any): ArtistaInterface{

        const artista: ArtistaInterface ={
            id:  data._id,
            bloqueado:  data.bloqueado,
            descripcion:  data.descripcion,
            fechaInicio:  data.fechaInicio,
            imagenID:  data.imagenID,
            imagenURL:  data.imagenURL,
            nombre:  data.nombre,
            pais: data.pais,
        };
        return artista;

    }


    get paises() {
        return [
            "AFGANISTÁN",
            "ALBANIA",
            "ALEMANIA",
            "ANDORRA",
            "ANGOLA",
            "ARABIA SAUDÍ",
            "ARGELIA",
            "ARGENTINA",
            "ARMENIA",
            "ARUBA",
            "AUSTRALIA",
            "AUSTRIA",
            "AZERBAIYÁN",
            "BAHAMAS",
            "BAHRÉIN",
            "BANGLADESH",
            "BARBADOS",
            "BELARRÚS",
            "BELICE",
            "BENÍN",
            "BOLIVIA",
            "BOTSUANA",
            "BRASIL",
            "BRUNÉI",
            "BULGARIA",
            "BURKINA FASO",
            "BURUNDI",
            "BUTÁN",
            "BÉLGICA",
            "CABO VERDE",
            "CAMBOYA",
            "CAMERÚN",
            "CANADÁ",
            "CATAR",
            "CHAD",
            "CHILE",
            "CHINA",
            "CHIPRE",
            "COLOMBIA",
            "COMORAS",
            "CONGO",
            "COREA (Rep. de)",
            "COSTA RICA",
            "CROACIA",
            "CUBA",
            "CURAZAO",
            "CÔTE D'IVOIRE",
            "DINAMARCA",
            "DOMINICA",
            "ECUADOR",
            "EGIPTO",
            "EL SALVADOR",
            "ERITREA",
            "ESLOVAQUIA",
            "ESLOVENIA",
            "ESPAÑA",
            "ESTADO DE PALESTINA",
            "ESTADOS UNIDOS",
            "ESTONIA",
            "ESWATINI",
            "ETIOPÍA",
            "FILIPINAS",
            "FINLANDIA",
            "FIYI",
            "FRANCIA",
            "GABÓN",
            "GAMBIA",
            "GEORGIA",
            "GHANA",
            "GRANADA",
            "GRECIA",
            "GUATEMALA",
            "GUINEA",
            "GUINEA BISSAU",
            "GUINEA ECUATORIAL",
            "GUYANA",
            "HAITÍ",
            "HONDURAS",
            "HUNGRÍA",
            "INDIA",
            "INDONESIA",
            "IRAK",
            "IRLANDA",
            "IRÁN",
            "ISLANDIA",
            "ISRAEL",
            "ITALIA",
            "JAMAICA",
            "JAPÓN",
            "JORDANIA",
            "KAZAJSTÁN",
            "KENIA",
            "KIRGUISTÁN",
            "KIRIBATI",
            "KUWAIT",
            "LAOS",
            "LESOTO",
            "LETONIA",
            "LIBERIA",
            "LIBIA",
            "LIECHTENSTEIN",
            "LITUANIA",
            "LUXEMBURGO",
            "LÍBANO",
            "MADAGASCAR",
            "MALASIA",
            "MALAUI",
            "MALDIVAS",
            "MALTA",
            "MALÍ",
            "MARRUECOS",
            "MARSHALL (Islas)",
            "MAURICIO",
            "MAURITANIA",
            "MOLDOVA",
            "MONGOLIA",
            "MONTENEGRO",
            "MOZAMBIQUE",
            "MYANMAR",
            "MÉXICO",
            "MÓNACO",
            "NAMIBIA",
            "NAURU",
            "NEPAL",
            "NICARAGUA",
            "NIGERIA",
            "NORUEGA",
            "NUEVA ZELANDA",
            "NÍGER",
            "OMÁN",
            "PAKISTÁN",
            "PANAMÁ",
            "PAPÚA NUEVA GUINEA",
            "PARAGUAY",
            "PAÍSES BAJOS",
            "PERÚ",
            "POLONIA",
            "PORTUGAL",
            "REINO UNIDO",
            "REP. CENTROAFRICANA",
            "REP. CHECA",
            "REP. DOMINICANA",
            "RUANDA",
            "RUMANIA",
            "RUSIA",
            "SALOMÓN (Islas)",
            "SAMOA",
            "SAN MARINO",
            "SAN MARTÍN",
            "SANTA LUCÍA",
            "SENEGAL",
            "SERBIA",
            "SEYCHELLES",
            "SIERRA LEONE",
            "SINGAPUR",
            "SIRIA",
            "SOMALIA",
            "SRI LANKA",
            "SUDÁFRICA",
            "SUDÁN",
            "SUDÁN DEL SUR",
            "SUECIA",
            "SUIZA",
            "SURINAM",
            "Tailandia",
            "TANZANIA",
            "TAYIKISTÁN",
            "TIMOR-LESTE",
            "TOGO",
            "TONGA",
            "TRINIDAD Y TOBAGO",
            "TURKMENISTÁN",
            "TURQUÍA",
            "TÚNEZ",
            "UCRANIA",
            "UGANDA",
            "URUGUAY",
            "UZBEKISTÁN",
            "VANUATU",
            "VENEZUELA",
            "VIETNAM",
            "YEMEN",
            "YIBUTI",
            "ZAMBIA",
            "ZIMBABUE"
        ];
    }


}


