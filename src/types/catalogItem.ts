export interface SpecField {
  id: string
  label: string
}

export interface CatalogItem {
  id: string
  name: string
  defaultUnit: string 
  relatedWorkId: string 
  specFields: SpecField[]
}