import * as z from 'zod'

// adapted from zod's deepPartialify function
export default function deepStrictify(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
    const oldShape = (schema as z.AnyZodObject).shape
    const newShape: Record<string, z.ZodTypeAny> = {}

    for (const key in oldShape) {
      if (Object.hasOwn(oldShape, key)) {
        const fieldSchema = oldShape[key]
        newShape[key] = deepStrictify(fieldSchema)
      }
    }
    return new z.ZodObject({
      ...schema._def,
      unknownKeys: 'strict',
      shape: () => newShape
    })
  } else if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodArray) {
    return new z.ZodArray({
      ...schema._def,
      type: deepStrictify((schema as z.ZodArray<z.ZodTypeAny>).element)
    })
  } else if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional) {
    return z.ZodOptional.create(deepStrictify((schema as z.ZodOptional<z.ZodTypeAny>).unwrap()))
  } else if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodNullable) {
    return z.ZodNullable.create(deepStrictify((schema as z.ZodNullable<z.ZodTypeAny>).unwrap()))
  } else if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodTuple) {
    return z.ZodTuple.create(
      (schema as z.AnyZodTuple).items.map((item) => deepStrictify(item)) as
        | [z.ZodTypeAny, ...z.ZodTypeAny[]]
        | []
    )
  } else {
    return schema
  }
}
