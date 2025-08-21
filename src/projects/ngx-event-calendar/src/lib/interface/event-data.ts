export interface EventData {
    id: number;
    title: string;
    desc?: string;
    startDate: Date;
    endDate: Date;
    createdBy?: string;
    createdAt?: Date;
    type?: number;
    color?: string;
}
