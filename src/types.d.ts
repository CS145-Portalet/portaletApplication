export type device={
    id:string;
    nickname:string;
    streetAddress:string;
    city:string;
    status:number;
    createdAt:number;
}

export type deviceLog={
    id:string;
    deviceID:string;
    status:string;
    createdAt:number;
}