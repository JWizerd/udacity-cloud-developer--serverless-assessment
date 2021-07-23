export interface Service {
  create?: (item: object) => Promise<any>
  delete?: (id: string) => Promise<any>
  update?: (id: string, item: object) => Promise<any>
  findAll?: () => Promise<any>
}