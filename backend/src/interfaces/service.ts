export interface Service {
  create?: (item: object, userId: string) => Promise<any>
  delete?: (id: string) => Promise<any>
  update?: (id: string, item: object) => Promise<any>
  findAll?: (userId: string) => Promise<any>
}