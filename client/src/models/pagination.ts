export interface IPagination<T> {
    count: number,
    pages: number,
    results: T[];
}

export interface IPaginationParams {
    page: number;
    page_size: number;
}
