enum FilterOptionEnum {
    all = 1,
    occupiedUnits,
    emptyUnits,
    chosenUnits
}

const FilterOption = {
    [FilterOptionEnum.all]: {
        id: FilterOptionEnum.all,
        title: 'همه'
    },
    [FilterOptionEnum.occupiedUnits]: {
        id: FilterOptionEnum.occupiedUnits,
        title: 'واحدهای پر'
    },
    [FilterOptionEnum.emptyUnits]: {
        id: FilterOptionEnum.emptyUnits,
        title: 'واحدهای خالی'
    },
    [FilterOptionEnum.chosenUnits]: {
        id: FilterOptionEnum.chosenUnits,
        title: 'واحدهای انتخابی'
    }
};

export {
    FilterOption,
    FilterOptionEnum
};
