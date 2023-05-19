import { type Document, type Model, Schema, model } from 'mongoose'

export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}
export interface IBeach {
  _id?: string
  name: string
  position: GeoPosition
  latitude: number
  longitude: number
  userId: string
}

const schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
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
