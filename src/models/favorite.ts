export interface Favorite {
    id?: string,
    userId: string,
    coin: {
        name: string,
        symbol: string
    }
    index?: number;
}