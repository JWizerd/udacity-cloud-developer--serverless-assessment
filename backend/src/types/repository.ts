export interface Repository {
  create?: (item: object, userId: string) => Promise<any>
  delete?: (id: string, userId?: string) => Promise<any>
  update?: (id: string, item: object, userId: string) => Promise<any>
  findAll?: (userId: string) => Promise<any>
}