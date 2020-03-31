enum SplitOptionEnum {
    equal = 1,
    residentCount,
    parkingSpaceCount,
    area,
    floor,
    specificCoefficients
}


const SplitOption = {
    [SplitOptionEnum.equal]: {
        id: SplitOptionEnum.equal,
        title: 'مساوی'
    },
    [SplitOptionEnum.residentCount]: {
        id: SplitOptionEnum.residentCount,
        title: 'تعداد ساکنین'
    },
    [SplitOptionEnum.parkingSpaceCount]: {
        id: SplitOptionEnum.parkingSpaceCount,
        title: 'تعداد پارکینگ‌ ها'
    },
    [SplitOptionEnum.area]: {
        id: SplitOptionEnum.area,
        title: 'مساحت'
    },
    [SplitOptionEnum.floor]: {
        id: SplitOptionEnum.floor,
        title: 'طبقه'
    },
    [SplitOptionEnum.specificCoefficients]: {
        id: SplitOptionEnum.specificCoefficients,
        title: 'ضرایب مشخص'
    }
};

export {
    SplitOption,
    SplitOptionEnum
};

