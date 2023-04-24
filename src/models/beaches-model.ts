import { type Document, type Model, Schema, model } from 'mongoose'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}
export interface IBeach {
  _id?: string
  name: string
  position: BeachPosition
  latitude: number
  longitude: number
}

const schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, {
  toJSON: {
    transform: (_, ret): void => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})
interface IBeachModel extends Omit<IBeach, '_id'>, Document { }
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const Beach: Model<IBeachModel> = model('Beach', schema)
