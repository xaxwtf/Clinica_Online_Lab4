import { DocumentData, DocumentReference } from "@angular/fire/compat/firestore";


export interface ILogs{
    uid_usuario:string,
    log_in:Date,
    log_out:Date
}