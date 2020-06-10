import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import ApartmentExpense from "./apartmentExpenses.entity";
import {ObjectLiteral} from "@interfaces";

@EntityRepository(ApartmentExpense)
class ApartmentExpenseRepository extends Repository<ApartmentExpense> {
    findByIds(ids: any[], options: ObjectLiteral): Promise<ApartmentExpense[]> {
        const aptExpSelect = [
            'id', 'amount', 'description', 'splitOption', 'filterOption', 'isDeclared', 'apartment', 'type', 'charge'
        ];
        const unitExp = ['id', 'amount'];
        return this.createQueryBuilder("aptExp")
            .select(aptExpSelect.map(s => `aptExp.${s}`))
            .addSelect(unitExp.map(s => `unitExp.${s}`))
            .addSelect('unitExp.unit', 'unitExp_unitId')
            .leftJoin('aptExp.unitExpenses', 'unitExp')
            .whereInIds(ids)
            .andWhere('aptExp.apartment = :aptId')
            .andWhere('aptExp.isDeclared = :isDeclared')
            .setParameters({
                aptId: options.apartment,
                isDeclared: options.isDeclared
            })
            .getMany();
    };
}

const getApartmentExpenseRepository = () => getCustomRepository(ApartmentExpenseRepository);

export default getApartmentExpenseRepository;
