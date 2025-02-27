import { mongodb, ObjectId } from "@fastify/mongodb";

/**
 * Converts a given string to an ObjectId. Falsy parameters given, will cause
 * returning a new random ObjectId
 * @param id 
 * @returns 
 */
export const buildObjectId = (id: string | null | undefined): mongodb.ObjectId => {
    if (!id) {
        return new ObjectId();
    }
    return new mongodb.ObjectId(id);
}