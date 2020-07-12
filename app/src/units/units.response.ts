import _ from "lodash";
import Unit from "./units.entity";

const createUnit = (unit, resident = undefined) : Unit => {
    return {
        ..._.pick(unit, ['id', 'title', 'floor', 'area', 'parkingSpaceCount',
            'residentCount', 'fixedCharge', 'powerConsumption', 'suggestedConsumptionCoefficient', 'isEmpty']),
        resident: resident ? _.pick(resident, ['firstName', 'lastName', 'mobileNumber']) : resident
    } as Unit;
};

export default {
    createUnit
}
