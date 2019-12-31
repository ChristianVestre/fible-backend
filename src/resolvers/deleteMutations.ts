import { findHtype } from '../helperFunction';
import { indexwithpipeline, index, remove } from '../db/db';
import { update } from './../db/db'
var now = new Date();
export default {
    deleteComponent: async (_: any, { parentHtype, component }: any, context: any) => {
        parentHtype = JSON.parse(parentHtype)
        console.log(parentHtype.components)
        console.log("parentHtype")
        component = JSON.parse(component)
        const type = findHtype(parentHtype.id)
        console.log(type)
        try {
            await update({
                doc: {
                    components: parentHtype.components,
                    lasteditat: now
                }
            }
                , type, parentHtype.id)
        } catch (error) {
            console.error(error)
            return error
        }
        try {
            await remove('components', component.id)
        } catch (error) {
            console.error(error)
            return error
        }
        return true
    },


}