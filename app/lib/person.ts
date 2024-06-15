import { Dayjs } from "dayjs";

export interface Person {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    dob: Dayjs;
}
